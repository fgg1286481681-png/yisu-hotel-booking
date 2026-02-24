import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Picker, Slider } from '@tarojs/components';
import Taro from '@tarojs/taro';
import HotelCard from '../../components/HotelCard';
import Calendar from '../../components/Calendar';
import { Hotel, HotelQueryParams, getHotels } from '../../../../shared/api';
import './list.css';

// 排序选项
const sortOptions = [
  { label: '推荐排序', value: 'recommend' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' },
  { label: '评分从高到低', value: 'rating_desc' },
  { label: '距离从近到远', value: 'distance_asc' },
];

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
    starRating: [3] as number[], // 默认3星，改为数组支持多选
    sortBy: 'recommend' as 'recommend' | 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc' | 'star_high',
  });

  const PRICE_MAX = 600;
  const priceQuickOptions: Array<{ label: string; value: [number, number] }> = [
    { label: '¥0-200', value: [0, 200] },
    { label: '¥200-300', value: [200, 300] },
    { label: '¥300-500', value: [300, 500] },
    { label: '¥500以上', value: [500, PRICE_MAX] },
  ];

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>(filters.priceRange);
  const [draftStarRating, setDraftStarRating] = useState<number[]>(filters.starRating);
  
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
  
  // 排序选项 - 对应api.ts中的排序参数
  const sortModalOptions = [
    { id: 'smart', label: '智能排序', value: 'recommend' },
    { id: 'price_low', label: '低价优先', value: 'price_asc' },
    { id: 'price_high', label: '高价优先', value: 'price_desc' },
    { id: 'rating', label: '好评优先', value: 'rating_desc' },
    { id: 'star_high', label: '高星优先', value: 'star_high' },
    { id: 'distance', label: '直线距离', value: 'distance_asc' },
  ];
  
  const [selectedSort, setSelectedSort] = useState('recommend');
  
  // 搜索参数（从首页传递）
  const [searchParams, setSearchParams] = useState<HotelQueryParams>({});

  const priceRangeText = useMemo(() => {
    const maxText = filters.priceRange[1] >= PRICE_MAX ? '500+' : String(filters.priceRange[1]);
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
      if (params.minPrice || params.maxPrice) {
        const min = params.minPrice ? Number(params.minPrice) : DEFAULT_PRICE_RANGE[0];
        const max = params.maxPrice ? Number(params.maxPrice) : DEFAULT_PRICE_RANGE[1];
        initialPriceRange = [min, max];
      }
      if (params.sort) newSearchParams.sort = params.sort as any;
      
      // 计算住几晚
      if (params.checkIn && params.checkOut) {
        const inDate = new Date(params.checkIn);
        const outDate = new Date(params.checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
      }
      
      setSearchParams(newSearchParams);
      setFilters(prev => ({ ...prev, priceRange: initialPriceRange }));
      setDraftPriceRange(initialPriceRange);
      
      // 更新页面标题
      if (newSearchParams.city) {
        Taro.setNavigationBarTitle({
          title: `${newSearchParams.city}酒店列表`,
        });
      }

      // 直接用解析后的参数加载，避免 state 尚未落盘就请求
      loadHotels(true, newSearchParams, { ...filters, priceRange: initialPriceRange });
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
    
    try {
      const effectiveSearch = searchOverride || searchParams;
      const effectiveFilters = filtersOverride || filters;
      const queryParams: HotelQueryParams = {
        ...effectiveSearch,
        page: currentPage,
        limit: 5,
      };
      
      // 应用筛选条件
      queryParams.minPrice = effectiveFilters.priceRange[0];
      queryParams.maxPrice = effectiveFilters.priceRange[1];
      if (effectiveFilters.starRating.length > 0) {
        // 注意：模拟数据中没有星级字段，实际项目中会有多星级筛选逻辑
        // 实际项目中可能通过多个参数传递多个星级，如starRating=3&starRating=4&starRating=5
      }
      
      // 应用排序
      if (effectiveFilters.sortBy !== 'recommend') {
        queryParams.sort = effectiveFilters.sortBy;
      }
      
      const data = await getHotels(queryParams);
      
      if (isRefresh) {
        setHotels(data);
        setPage(1);
      } else {
        setHotels(prev => [...prev, ...data]);
        setPage(currentPage + 1);
      }
      
      // 模拟是否有更多数据
      setHasMore(data.length === 5);
      setTotal(prev => isRefresh ? data.length : prev + data.length);
      
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
      starRating: [3], // 重置为3星数组，与默认值保持一致
      sortBy: 'recommend',
    });
    setSelectedSort('recommend');
    setDraftPriceRange(DEFAULT_PRICE_RANGE);
    setDraftStarRating([3]); // 重置为3星数组，与默认值保持一致
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
    Taro.navigateTo({
      url: `/pages/detail/detail?id=${hotel.id}`,
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
    setFilters(prev => ({ 
      ...prev, 
      priceRange: draftPriceRange,
      starRating: draftStarRating 
    }));
    setShowPriceModal(false);
    loadHotels(true, undefined, { 
      ...filters, 
      priceRange: draftPriceRange,
      starRating: draftStarRating 
    });
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

  // 应用导航栏修改
  const applyNavChanges = () => {
    setShowNavModal(false);
    // 这里可以添加更新搜索参数的逻辑
    // 例如：重新加载酒店数据
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
                    <Text className="modal-slider-min">¥0</Text>
                    <Slider
                      className="modal-slider"
                      min={0}
                      max={PRICE_MAX}
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
                      min={0}
                      max={PRICE_MAX}
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
                      className="modal-quick-btn"
                      onClick={() => setDraftPriceRange([opt.value[0], opt.value[1]])}
                    >
                      <Text>{opt.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className="modal-star-block">
                <Text className="modal-star-label">星级（可多选）</Text>
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
              
              {/* 确定按钮 */}
              <View className="price-modal-actions">
                <View className="price-modal-button" onClick={applyDraftPrice}>
                  <Text className="price-modal-button-text">确定</Text>
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
                <View className="city-item" onClick={() => { setLocation({...location, city: '北京'}); setShowCityModal(false); }}>
                  <Text>北京</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({...location, city: '上海'}); setShowCityModal(false); }}>
                  <Text>上海</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({...location, city: '广州'}); setShowCityModal(false); }}>
                  <Text>广州</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({...location, city: '深圳'}); setShowCityModal(false); }}>
                  <Text>深圳</Text>
                </View>
                <View className="city-item" onClick={() => { setLocation({...location, city: '杭州'}); setShowCityModal(false); }}>
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
        <Text className="results-count">共找到 {total} 家酒店</Text>
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
            <Text className="empty-title">暂无符合条件的酒店</Text>
            <Text className="empty-desc">尝试调整筛选条件或选择其他城市</Text>
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