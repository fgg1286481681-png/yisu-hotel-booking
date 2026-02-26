import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Picker, Slider } from '@tarojs/components';
import Taro from '@tarojs/taro';
import HotelCard from '../../components/HotelCard';
import Calendar from '../../components/Calendar';
import { Hotel, HotelQueryParams, getHotels } from '../../services/unifiedApi';
import './list.css';

// 排序类型（智能 / 低价 / 高价 / 好评 / 高星 / 距离）
type SortType = 'recommend' | 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc' | 'star_high';

// 排序选项（顶部文案）
const sortOptions = [
  { label: '推荐排序', value: 'recommend' as SortType },
  { label: '价格从低到高', value: 'price_asc' as SortType },
  { label: '价格从高到低', value: 'price_desc' as SortType },
  { label: '评分从高到低', value: 'rating_desc' as SortType },
  { label: '距离从近到远', value: 'distance_asc' as SortType },
];

// 本地排序函数：保证“智能 / 低价 / 高价 / 高星”等排序在前端稳定生效
const sortHotelsLocally = (list: Hotel[], sortBy: SortType): Hotel[] => {
  const hotelsCopy = [...list];

  switch (sortBy) {
    case 'price_asc':
      hotelsCopy.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      hotelsCopy.sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      hotelsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'star_high':
      // 高星优先：按星级从高到低
      hotelsCopy.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
      break;
    case 'distance_asc':
      hotelsCopy.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      break;
    case 'recommend':
    default:
      // 智能排序：综合“评分高 + 价格更优”
      hotelsCopy.sort((a, b) => {
        const scoreA = (a.rating || 0) * 20 - a.price / 50;
        const scoreB = (b.rating || 0) * 20 - b.price / 50;
        return scoreB - scoreA;
      });
      break;
  }

  return hotelsCopy;
};

// 星级选项
const starOptions = [
  { label: '不限', value: 0 },
  { label: '经济型', value: 1 },
  { label: '舒适型', value: 2 },
  { label: '高档型', value: 3 },
  { label: '豪华型', value: 4 },
  { label: '五星级', value: 5 },
];

const ListPage: React.FC = () => {
  // 状态管理
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 筛选条件
  const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000]; // 扩大默认价格范围以显示更多酒店
  const [filters, setFilters] = useState({
    priceRange: DEFAULT_PRICE_RANGE as [number, number],
    starRating: [] as number[], // 默认为不限星级（空数组）
    sortBy: 'recommend' as SortType,
  });

  // 价格上限滑块的最大值（用于“400以上”这一档，600 仅作为内部标记，不直接展示给用户）
  const PRICE_MAX = 600;
  // 价格下限可选的最大值为 400
  const PRICE_MIN_MAX = 400;
  const priceQuickOptions: Array<{ label: string; value: [number, number] }> = [
    { label: '¥0-200', value: [0, 200] },
    { label: '¥200-300', value: [200, 300] },
    { label: '¥300-500', value: [300, 500] },
    { label: '¥500以上', value: [500, PRICE_MAX] },
  ];

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>(filters.priceRange);
  const [draftStarRating, setDraftStarRating] = useState<number[]>(filters.starRating);
  const [selectedPriceOption, setSelectedPriceOption] = useState<number | null>(null);

  // 导航栏和伪窗口状态
  const [showNavModal, setShowNavModal] = useState(false);
  const [location, setLocation] = useState({
    city: '北京',
    address: '北京市朝阳区',
  });
  const [checkInDate, setCheckInDate] = useState('2024-01-15');
  const [checkOutDate, setCheckOutDate] = useState('2024-01-16');
  const [nights, setNights] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);

  // 子模态窗口状态
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showDistanceModal, setShowDistanceModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // 日历组件状态
  const [showCalendar, setShowCalendar] = useState(false);

  // 排序选项 - 对应排序参数
  const sortModalOptions = [
    { id: 'smart', label: '智能排序', value: 'recommend' as SortType },
    { id: 'price_low', label: '低价优先', value: 'price_asc' as SortType },
    { id: 'price_high', label: '高价优先', value: 'price_desc' as SortType },
    { id: 'rating', label: '好评优先', value: 'rating_desc' as SortType },
    { id: 'star_high', label: '高星优先', value: 'star_high' as SortType },
    { id: 'distance', label: '直线距离', value: 'distance_asc' as SortType },
  ];

  const [selectedSort, setSelectedSort] = useState('recommend');

  // 搜索参数（从首页传递）
  const [searchParams, setSearchParams] = useState<HotelQueryParams>({});

  const priceRangeText = useMemo(() => {
    const maxText = filters.priceRange[1] >= PRICE_MAX ? '400+' : String(filters.priceRange[1]);
    return `¥${filters.priceRange[0]} - ¥${maxText}`;
  }, [filters.priceRange]);

  // 初始化 - 获取URL参数
  useEffect(() => {
    const currentPage = Taro.getCurrentPages().pop();
    if (currentPage?.options) {
      const params = currentPage.options;
      const newSearchParams: HotelQueryParams = {};
      let initialPriceRange: [number, number] = DEFAULT_PRICE_RANGE;

      if (params.city) {
        // 处理从首页传过来的中文城市名（URLSearchParams 会进行编码）
        try {
          const city = decodeURIComponent(params.city);
          newSearchParams.city = city;
          // 更新导航栏状态
          setLocation(prev => ({ ...prev, city }));
        } catch {
          newSearchParams.city = params.city;
          setLocation(prev => ({ ...prev, city: params.city }));
        }
      }
      if (params.checkIn) {
        newSearchParams.checkIn = params.checkIn;
        setCheckInDate(params.checkIn);
      }
      if (params.checkOut) {
        newSearchParams.checkOut = params.checkOut;
        setCheckOutDate(params.checkOut);
      }
      if (params.minPrice) {
        const min = Number(params.minPrice);
        // 如果有 maxPrice，用它；否则如果 min >= 400（用户选择的是"400以上"），则不限制最大价格
        // PRICE_MAX=600 代表滑块的"400以上"档位
        const max = params.maxPrice
          ? Number(params.maxPrice)
          : (min >= 500 ? PRICE_MAX : DEFAULT_PRICE_RANGE[1]);
        initialPriceRange = [min, max];
      } else if (params.maxPrice) {
        // 只有 maxPrice 的情况
        initialPriceRange = [0, Number(params.maxPrice)];
      }
      if (params.sort) newSearchParams.sort = params.sort as any;

      // 处理星级参数（可能为数组或逗号分隔的字符串）
      let initialStarRating: number[] = []; // 默认不限（空数组）
      if (params.starRating) {
        if (Array.isArray(params.starRating)) {
          // 如果是数组，转换为数字数组
          initialStarRating = params.starRating.map(r => Number(r));
        } else if (typeof params.starRating === 'string') {
          // 如果是逗号分隔的字符串，如"3,4,5"
          if (params.starRating.includes(',')) {
            initialStarRating = params.starRating.split(',').map(r => Number(r.trim()));
          } else {
            // 单个值
            initialStarRating = [Number(params.starRating)];
          }
        }
      }

      // 计算住几晚
      if (params.checkIn && params.checkOut) {
        const inDate = new Date(params.checkIn);
        const outDate = new Date(params.checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
      }

      setSearchParams(newSearchParams);
      setFilters(prev => ({ ...prev, priceRange: initialPriceRange, starRating: initialStarRating }));
      setDraftPriceRange(initialPriceRange);
      setDraftStarRating(initialStarRating);

      // 更新页面标题
      if (newSearchParams.city) {
        Taro.setNavigationBarTitle({
          title: `${newSearchParams.city}酒店列表`,
        });
      }

      // 直接用解析后的参数加载，避免 state 尚未落盘就请求
      const initialFilters = {
        priceRange: initialPriceRange,
        starRating: initialStarRating,
        sortBy: 'recommend' as const,
      };
      loadHotels(true, newSearchParams, initialFilters);
      return;
    }

    // 加载初始数据
    loadHotels(true);
  }, []);

  // 加载酒店数据
  const loadHotels = async (
    isRefresh = false,
    searchOverride?: HotelQueryParams,
    filtersOverride?: typeof filters
  ) => {
    if (loading) return;

    setLoading(true);
    const currentPage = isRefresh ? 1 : page;

    // 延迟0.5秒，让加载提示可见
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const effectiveSearch = searchOverride || searchParams;
      const effectiveFilters = filtersOverride || filters;
      const queryParams: HotelQueryParams = {
        ...effectiveSearch,
        page: currentPage,
        limit: 5,
      };

      // 应用筛选条件 - 只有当价格不是默认值时才传递价格参数
      if (effectiveFilters.priceRange[0] !== 0 || effectiveFilters.priceRange[1] !== 1000) {
        queryParams.minPrice = effectiveFilters.priceRange[0];
        // 如果最大值是 PRICE_MAX（600，代表500以上），则不限制最大价格
        if (effectiveFilters.priceRange[1] < PRICE_MAX) {
          queryParams.maxPrice = effectiveFilters.priceRange[1];
        }
      }
      // 只有当用户选择了星级时才传递星级筛选（空数组表示不限）
      if (effectiveFilters.starRating.length > 0) {
        queryParams.starRating = effectiveFilters.starRating;
      }

      // 应用排序
      if (effectiveFilters.sortBy !== 'recommend') {
        queryParams.sort = effectiveFilters.sortBy;
      }

      const data = await getHotels(queryParams);

      // 先在前端按照价格区间和星级做一次兜底过滤，避免后端未完全处理筛选条件
      const filteredData = data.filter(hotel => {
        const [minPrice, maxPrice] = effectiveFilters.priceRange;

        // 价格下限过滤
        if (hotel.price < minPrice) {
          return false;
        }

        // 价格上限过滤（当 maxPrice 为 PRICE_MAX 时，表示"400以上"，不再限制上限）
        if (maxPrice < PRICE_MAX && hotel.price > maxPrice) {
          return false;
        }

        // 星级过滤（空数组表示不限）
        if (
          effectiveFilters.starRating.length > 0 &&
          !effectiveFilters.starRating.includes(hotel.starRating || 0)
        ) {
          return false;
        }

        return true;
      });

      // 无论后端是否支持排序参数，这里都在前端兜底做一次排序，确保用户所见顺序正确
      const sortedData = sortHotelsLocally(filteredData, effectiveFilters.sortBy as SortType);

      // 强制只取前5条数据（前端分页）
      const displayData = sortedData.slice(0, 5);

      if (isRefresh) {
        // 刷新时直接覆盖列表
        setHotels(displayData);
        setPage(1);

        // 如果是重新筛选后的首次加载且没有匹配酒店，给出友好提示
        if (displayData.length === 0) {
          Taro.showToast({
            title: '未搜索到合适的目标',
            icon: 'none',
            duration: 2000,
          });
        }

        // 是否还有更多数据：过滤后总数大于当前展示数量
        setHasMore(sortedData.length > displayData.length);
        setTotal(sortedData.length);
      } else {
        // 加载更多时，需要避免因为后端/Mock 忽略分页参数导致的“同一批酒店重复追加”
        setHotels(prev => {
          const existingIds = new Set(prev.map(h => h.id));
          const newItems = displayData.filter(h => !existingIds.has(h.id));

          const merged = [...prev, ...newItems];

          // 如果这一页完全没有带来新的酒店，说明已经到底了，停止继续加载
          if (newItems.length === 0) {
            setHasMore(false);
          } else {
            // 只有当本页满额且有新增数据时，才认为还有更多
            setHasMore(displayData.length === newItems.length && displayData.length === 5);
          }

          // 记录一个大致的总数：取“已加载数量”和“本次过滤总数”的较大值
          setTotal(prevTotal => Math.max(prevTotal, merged.length, sortedData.length));

          return merged;
        });

        setPage(currentPage + 1);
      }

    } catch (error) {
      console.error('加载酒店数据失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理筛选条件变化
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // 应用筛选
  const applyFilters = () => {
    loadHotels(true);
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      priceRange: DEFAULT_PRICE_RANGE,
      starRating: [], // 重置为不限星级（空数组）
      sortBy: 'recommend',
    });
    setSelectedSort('recommend');
    setDraftPriceRange(DEFAULT_PRICE_RANGE);
    setDraftStarRating([]); // 重置为不限星级（空数组）
    loadHotels(true);
  };

  // 上拉加载更多
  const handleScrollToLower = () => {
    if (!loading && hasMore) {
      loadHotels(false);
    }
  };

  // 下拉刷新
  const handleRefresh = () => {
    loadHotels(true);
  };

  // 跳转到详情页
  const handleHotelClick = (hotel: Hotel) => {
    const params = {
      id: hotel.id.toString(),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      roomCount: roomCount.toString(),
      adultCount: adultCount.toString(),
      childCount: childCount.toString(),
    };

    Taro.navigateTo({
      url: `/pages/detail/detail?${new URLSearchParams(params).toString()}`,
    });
  };

  // 跳转到搜索页面
  const handleSearchClick = () => {
    Taro.navigateTo({
      url: `/pages/search/search?city=${encodeURIComponent(location.city)}`,
    });
  };

  const handleDraftMinChange = (e: any) => {
    const v = Number(e.detail.value);
    setDraftPriceRange(prev => [v, prev[1] < v ? v : prev[1]]);
  };
  const handleDraftMaxChange = (e: any) => {
    const v = Number(e.detail.value);
    setDraftPriceRange(prev => [prev[0] > v ? v : prev[0], v]);
  };
  const applyDraftPrice = () => {
    const newFilters = {
      priceRange: draftPriceRange,
      starRating: draftStarRating,
      sortBy: filters.sortBy,
    };
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setShowPriceModal(false);
    loadHotels(true, undefined, newFilters);
  };

  // 导航栏和伪窗口处理函数
  // 获取当前位置
  const getCurrentLocation = () => {
    Taro.getLocation({
      type: 'wgs84',
      success: (_res) => {
        // 这里应该调用逆地理编码API获取城市名称
        // 暂时使用模拟数据
        setLocation({
          city: '北京',
          address: '北京市朝阳区',
        });
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
        Taro.showToast({
          title: '定位失败，请手动选择城市',
          icon: 'none',
        });
      },
    });
  };

  // 处理日期变化
  const handleCheckInDateChange = (e: any) => {
    setCheckInDate(e.detail.value);
    // 计算住几晚
    const inDate = new Date(e.detail.value);
    const outDate = new Date(checkOutDate);
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNights(diffDays);
  };

  const handleCheckOutDateChange = (e: any) => {
    setCheckOutDate(e.detail.value);
    // 计算住几晚
    const inDate = new Date(checkInDate);
    const outDate = new Date(e.detail.value);
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNights(diffDays);
  };

  // 处理房间人数变化
  const handleRoomCountChange = (e: any) => {
    setRoomCount(Number(e.detail.value) + 1);
  };

  const handleAdultCountChange = (e: any) => {
    setAdultCount(Number(e.detail.value) + 1);
  };

  const handleChildCountChange = (e: any) => {
    setChildCount(Number(e.detail.value));
  };

  // 处理日历选择
  const handleDateSelect = (value: string | [string, string]) => {
    if (Array.isArray(value)) {
      const [startDate, endDate] = value;
      setCheckInDate(startDate);
      setCheckOutDate(endDate);

      // 计算住几晚
      const inDate = new Date(startDate);
      const outDate = new Date(endDate);
      const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
    setShowCalendar(false);
  };

  // 应用导航栏修改（城市 / 日期 / 房间人数）
  const applyNavChanges = () => {
    setShowNavModal(false);

    // 将当前位置和日期写入搜索参数，并按新城市重新搜索
    const newSearchParams: HotelQueryParams = {
      ...searchParams,
      city: location.city,        // 按当前选择的城市搜索
      checkIn: checkInDate,       // 使用当前入住日期
      checkOut: checkOutDate,     // 使用当前离店日期
    };

    setSearchParams(newSearchParams);

    // 更新页面标题为当前城市
    if (location.city) {
      Taro.setNavigationBarTitle({
        title: `${location.city}酒店列表`,
      });
    }

    // 使用最新搜索条件刷新酒店列表
    loadHotels(true, newSearchParams);
  };

  // 星级显示文本
  const starText = useMemo(() => {
    if (filters.starRating.length === 0) {
      return '不限';
    }
    if (filters.starRating.length === 1) {
      const star = filters.starRating[0];
      return starOptions.find(opt => opt.value === star)?.label || '不限';
    }
    // 多星级显示为"多选"
    return '多选';
  }, [filters.starRating]);

  // 排序显示文本
  const sortText = sortOptions.find(opt => opt.value === filters.sortBy)?.label || '推荐排序';

  return (
    <View className="list-page">
      {/* 导航栏 */}
      <View className="nav-bar">
        <View className="nav-section nav-info" onClick={() => setShowNavModal(true)}>
          <View className="nav-grid">
            <View className="nav-cell">
              <Text className="nav-cell-label">我的</Text>
              <Text className="nav-cell-label">位置</Text>
            </View>
            <View className="nav-cell">
              <Text className="nav-cell-value">{checkInDate.split('-').slice(1).join('/')}</Text>
              <Text className="nav-cell-value">{checkOutDate.split('-').slice(1).join('/')}</Text>
            </View>
            <View className="nav-cell">
              <Text className="nav-cell-value">{roomCount}间</Text>
              <Text className="nav-cell-value">{adultCount + childCount}人</Text>
            </View>
          </View>
        </View>
        <View className="nav-section nav-search">
          <View className="search-box" onClick={handleSearchClick}>
            <Text className="search-icon">🔍</Text>
            <Text className="search-placeholder">位置/品牌/酒店</Text>
          </View>
        </View>
        <View className="nav-section nav-map">
          <View className="map-icon">
            <Text>🗺️</Text>
          </View>
        </View>
      </View>

      {/* 筛选面板 */}
      <View className="filter-panel">
        <View className="filter-row">
          <View className="filter-item" onClick={() => setShowSortModal(true)}>
            <Text className="filter-label">
              {sortModalOptions.find(opt => opt.value === selectedSort)?.label || '智能排序'}▼
            </Text>
          </View>

          <View className="filter-item" onClick={() => setShowDistanceModal(true)}>
            <Text className="filter-label">位置距离▼</Text>
          </View>

          <View className="filter-item" onClick={() => {
            setDraftPriceRange(filters.priceRange);
            setDraftStarRating(filters.starRating);
            // 根据当前价格范围确定选中的快捷选项
            const quickIndex = priceQuickOptions.findIndex(
              opt => opt.value[0] === filters.priceRange[0] &&
                (opt.value[1] === filters.priceRange[1] ||
                  (filters.priceRange[1] >= 600 && opt.value[1] === 600))
            );
            setSelectedPriceOption(quickIndex >= 0 ? quickIndex : null);
            setShowPriceModal(true);
          }}>
            <Text className="filter-label">价格/星级▼</Text>
          </View>

          <View className="filter-item" onClick={() => setShowFilterModal(true)}>
            <Text className="filter-label">筛选▼</Text>
          </View>
        </View>
      </View>

      {/* 价格/星级筛选弹窗 */}
      {showPriceModal && (
        <View className="price-star-modal-mask">
          <View className="price-star-modal-overlay" onClick={() => setShowPriceModal(false)} />
          <View className="price-star-modal-panel">
            <View className="price-star-modal-header">
              <Text className="price-star-modal-title">价格 / 星级</Text>
              <View className="price-star-modal-close" onClick={() => setShowPriceModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="price-star-modal-body">
              <View className="modal-price-block">
                <Text className="modal-price-label">价格区间：¥{draftPriceRange[0]} - ¥{draftPriceRange[1] >= PRICE_MAX ? '500+' : draftPriceRange[1]}</Text>
                <View className="modal-sliders">
                  <View className="modal-slider-row">
                    <Text className="modal-slider-min">¥{draftPriceRange[0]}</Text>
                    <Slider
                      className="modal-slider"
                      min={0}
                      max={500}
                      value={draftPriceRange[0]}
                      onChanging={handleDraftMinChange}
                      onChange={handleDraftMinChange}
                      blockSize={24}
                      backgroundColor="#f0f0f0"
                      activeColor="#1890ff"
                    />
                  </View>
                  <View className="modal-slider-row">
                    <Text className="modal-slider-min">¥{draftPriceRange[1] >= PRICE_MAX ? '500+' : draftPriceRange[1]}</Text>
                    <Slider
                      className="modal-slider"
                      min={1}
                      max={500}
                      value={draftPriceRange[1]}
                      onChanging={handleDraftMaxChange}
                      onChange={handleDraftMaxChange}
                      blockSize={24}
                      backgroundColor="#f0f0f0"
                      activeColor="#1890ff"
                    />
                  </View>
                </View>
                <View className="modal-quick-price">
                  {priceQuickOptions.map((opt, i) => (
                    <View
                      key={i}
                      className={`modal-quick-btn ${selectedPriceOption === i ? 'selected' : ''}`}
                      onClick={() => {
                        setDraftPriceRange([opt.value[0], opt.value[1]]);
                        setSelectedPriceOption(i);
                      }}
                    >
                      <Text>{opt.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className="modal-star-block">
                <Text className="modal-star-label">星级</Text>
                <View className="modal-star-buttons">
                  {[2, 3, 4, 5].map(star => (
                    <View
                      key={star}
                      className={`modal-star-btn ${draftStarRating.includes(star) ? 'active' : ''}`}
                      onClick={() => {
                        setDraftStarRating(prev => {
                          if (prev.includes(star)) {
                            // 如果已经选中，则移除
                            return prev.filter(s => s !== star);
                          } else {
                            // 如果未选中，则添加
                            return [...prev, star];
                          }
                        });
                      }}
                    >
                      <Text>⭐ {star}星</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="modal-button-group">
                <View className="modal-button clear-button" onClick={() => {
                  setDraftPriceRange(DEFAULT_PRICE_RANGE);
                  setDraftStarRating([]);
                  setSelectedPriceOption(null);
                }}>
                  <Text>清除</Text>
                </View>
                <View className="modal-button confirm-button" onClick={applyDraftPrice}>
                  <Text>确定</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 智能排序模态窗口 */}
      {showSortModal && (
        <View className="sort-modal-mask">
          <View className="sort-modal-overlay" onClick={() => setShowSortModal(false)} />
          <View className="sort-modal-panel">
            <View className="sort-modal-header">
              <Text className="sort-modal-title">排序方式</Text>
              <View className="sort-modal-close" onClick={() => setShowSortModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="sort-modal-body">
              {sortModalOptions.map(option => (
                <View
                  key={option.id}
                  className="sort-modal-row"
                  onClick={() => {
                    setSelectedSort(option.value);
                    // 设置排序方式并重新加载数据
                    setFilters(prev => {
                      const newFilters = { ...prev, sortBy: option.value as any };
                      // 在状态更新后立即重新加载数据
                      setTimeout(() => {
                        loadHotels(true, undefined, newFilters);
                      }, 0);
                      return newFilters;
                    });
                    setShowSortModal(false);
                  }}
                >
                  <Text
                    className="sort-modal-row-label"
                    style={{
                      fontSize: '24rpx',
                      color: selectedSort === option.value ? '#1890ff' : '#666'
                    }}
                  >
                    {option.label}
                  </Text>
                  <View className="sort-modal-row-right">
                    {selectedSort === option.value && (
                      <Text className="sort-modal-check">✓</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 位置距离模态窗口 */}
      {showDistanceModal && (
        <View className="distance-modal-mask">
          <View className="distance-modal-overlay" onClick={() => setShowDistanceModal(false)} />
          <View className="distance-modal-panel">
            <View className="distance-modal-header">
              <Text className="distance-modal-title">位置距离</Text>
              <View className="distance-modal-close" onClick={() => setShowDistanceModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="distance-modal-body">
              <Text style={{ fontSize: '28rpx', color: '#666', textAlign: 'center', padding: '80rpx 0' }}>
                位置距离筛选功能开发中...
              </Text>
              <View className="distance-modal-actions">
                <View className="distance-modal-button" onClick={() => setShowDistanceModal(false)}>
                  <Text className="distance-modal-button-text">确定</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 筛选模态窗口 */}
      {showFilterModal && (
        <View className="filter-modal-mask">
          <View className="filter-modal-overlay" onClick={() => setShowFilterModal(false)} />
          <View className="filter-modal-panel">
            <View className="filter-modal-header">
              <Text className="filter-modal-title">更多筛选</Text>
              <View className="filter-modal-close" onClick={() => setShowFilterModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="filter-modal-body">
              <Text style={{ fontSize: '28rpx', color: '#666', textAlign: 'center', padding: '80rpx 0' }}>
                更多筛选功能开发中...
              </Text>
              <View className="filter-modal-actions">
                <View className="filter-modal-button" onClick={() => setShowFilterModal(false)}>
                  <Text className="filter-modal-button-text">确定</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 导航栏伪窗口 */}
      {showNavModal && (
        <View className="nav-modal-mask">
          <View className="nav-modal-overlay" onClick={() => setShowNavModal(false)} />
          <View className="nav-modal-panel">
            <View className="nav-modal-header">
              <Text className="nav-modal-title">修改搜索条件</Text>
              <View className="nav-modal-close" onClick={() => setShowNavModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="nav-modal-body">
              {/* 第一行：位置选择 */}
              <View className="nav-modal-row" onClick={() => setShowCityModal(true)}>
                <View className="nav-modal-row-left">
                  <Text className="nav-modal-row-label">位置</Text>
                  <Text className="nav-modal-row-value">{location.city}</Text>
                </View>
                <View className="nav-modal-row-right">
                  <View className="nav-modal-icon" onClick={(e) => { e.stopPropagation(); getCurrentLocation(); }}>
                    <Text>📍</Text>
                  </View>
                </View>
              </View>

              {/* 第二行：日期选择 */}
              <View className="nav-modal-row" onClick={() => setShowCalendar(true)}>
                <View className="nav-modal-row-left">
                  <Text className="nav-modal-row-label">日期</Text>
                  <View className="nav-modal-dates">
                    <Text className="nav-modal-date">{checkInDate}</Text>
                    <Text className="nav-modal-date-separator">-</Text>
                    <Text className="nav-modal-date">{checkOutDate}</Text>
                  </View>
                </View>
                <View className="nav-modal-row-right">
                  <Text className="nav-modal-nights">{nights}晚</Text>
                </View>
              </View>

              {/* 第三行：房间人数 */}
              <View className="nav-modal-row" onClick={() => setShowRoomModal(true)}>
                <View className="nav-modal-row-left">
                  <Text className="nav-modal-row-label">房间/人数</Text>
                  <Text className="nav-modal-row-value">{roomCount}间，{adultCount + childCount}人</Text>
                </View>
                <View className="nav-modal-row-right">
                  <Text>›</Text>
                </View>
              </View>

              {/* 第四行：确定按钮 */}
              <View className="nav-modal-actions">
                <View className="nav-modal-button" onClick={applyNavChanges}>
                  <Text className="nav-modal-button-text">确定</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 城市选择模态窗口 */}
      {showCityModal && (
        <View className="city-modal-mask">
          <View className="city-modal-overlay" onClick={() => setShowCityModal(false)} />
          <View className="city-modal-panel">
            <View className="city-modal-header">
              <Text className="city-modal-title">选择城市</Text>
              <View className="city-modal-close" onClick={() => setShowCityModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="city-modal-body">
              <View className="city-search">
                <Text>搜索城市...</Text>
              </View>
              <View className="city-list">
                <View className="city-item" onClick={() => { setLocation({ ...location, city: '北京' }); setShowCityModal(false); }}>
                  <Text>北京</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({ ...location, city: '上海' }); setShowCityModal(false); }}>
                  <Text>上海</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({ ...location, city: '广州' }); setShowCityModal(false); }}>
                  <Text>广州</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({ ...location, city: '深圳' }); setShowCityModal(false); }}>
                  <Text>深圳</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({ ...location, city: '杭州' }); setShowCityModal(false); }}>
                  <Text>杭州</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}



      {/* 房间人数选择模态窗口 */}
      {showRoomModal && (
        <View className="room-modal-mask">
          <View className="room-modal-overlay" onClick={() => setShowRoomModal(false)} />
          <View className="room-modal-panel">
            <View className="room-modal-header">
              <Text className="room-modal-title">房间和人数</Text>
              <View className="room-modal-close" onClick={() => setShowRoomModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="room-modal-body">
              <View className="room-control-row">
                <Text className="room-control-label">房间</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => setRoomCount(Math.max(1, roomCount - 1))}>
                    <Text>-</Text>
                  </View>
                  <Text className="room-control-value">{roomCount}间</Text>
                  <View className="room-control-button" onClick={() => setRoomCount(roomCount + 1)}>
                    <Text>+</Text>
                  </View>
                </View>
              </View>
              <View className="room-control-row">
                <Text className="room-control-label">成人</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))}>
                    <Text>-</Text>
                  </View>
                  <Text className="room-control-value">{adultCount}人</Text>
                  <View className="room-control-button" onClick={() => setAdultCount(adultCount + 1)}>
                    <Text>+</Text>
                  </View>
                </View>
              </View>
              <View className="room-control-row">
                <Text className="room-control-label">儿童</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => setChildCount(Math.max(0, childCount - 1))}>
                    <Text>-</Text>
                  </View>
                  <Text className="room-control-value">{childCount}人</Text>
                  <View className="room-control-button" onClick={() => setChildCount(childCount + 1)}>
                    <Text>+</Text>
                  </View>
                </View>
              </View>
              <View className="room-modal-actions">
                <View className="room-modal-button" onClick={() => setShowRoomModal(false)}>
                  <Text className="room-modal-button-text">确定</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 搜索结果信息 */}
      <View className="results-info">
        {searchParams.city && (
          <Text className="search-city">搜索城市: {searchParams.city}</Text>
        )}
      </View>

      {/* 酒店列表 */}
      <ScrollView
        className="hotels-scroll"
        scrollY
        onScrollToLower={handleScrollToLower}
        onRefresherRefresh={handleRefresh}
        refresherEnabled
        refresherTriggered={loading}
      >
        <View className="hotels-list">
          {hotels.map(hotel => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onClick={handleHotelClick}
            />
          ))}
        </View>

        {/* 加载状态 */}
        {loading && (
          <View className="loading-more">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}

        {/* 没有更多数据 */}
        {!hasMore && hotels.length > 0 && (
          <View className="no-more">
            <Text className="no-more-text">没有更多酒店了</Text>
          </View>
        )}

        {/* 空状态 */}
        {!loading && hotels.length === 0 && (
          <View className="empty-state">
            <Text className="empty-icon">🏨</Text>
            <Text className="empty-title">未搜索到合适的目标</Text>
            <Text className="empty-desc">尝试调整价格区间、星级或其他筛选条件</Text>
            <View className="empty-action" onClick={resetFilters}>
              <Text className="empty-action-text">重置筛选条件</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 回到顶部按钮 */}
      {hotels.length > 5 && (
        <View
          className="back-to-top"
          onClick={() => {
            Taro.pageScrollTo({
              scrollTop: 0,
              duration: 300,
            });
          }}
        >
          <Text className="back-to-top-text">↑</Text>
        </View>
      )}

      {/* 日历组件 */}
      <Calendar
        mode="range"
        value={[checkInDate, checkOutDate]}
        onChange={handleDateSelect}
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
      />
    </View>
  );
};

export default ListPage;
