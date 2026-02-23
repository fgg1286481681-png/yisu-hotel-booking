import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Picker, Slider } from '@tarojs/components';
import Taro from '@tarojs/taro';
import HotelCard from '../../components/HotelCard';
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
  const DEFAULT_PRICE_RANGE: [number, number] = [200, 600]; // 与首页默认保持一致（¥500+ 用 600 表示）
  const [filters, setFilters] = useState({
    priceRange: DEFAULT_PRICE_RANGE as [number, number],
    starRating: 0,
    sortBy: 'recommend' as 'recommend' | 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc',
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
          newSearchParams.city = decodeURIComponent(params.city);
        } catch {
          newSearchParams.city = params.city;
        }
      }
      if (params.checkIn) newSearchParams.checkIn = params.checkIn;
      if (params.checkOut) newSearchParams.checkOut = params.checkOut;
      if (params.minPrice || params.maxPrice) {
        const min = params.minPrice ? Number(params.minPrice) : DEFAULT_PRICE_RANGE[0];
        const max = params.maxPrice ? Number(params.maxPrice) : DEFAULT_PRICE_RANGE[1];
        initialPriceRange = [min, max];
      }
      if (params.sort) newSearchParams.sort = params.sort as any;
      
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
        limit: 10,
      };
      
      // 应用筛选条件
      queryParams.minPrice = effectiveFilters.priceRange[0];
      queryParams.maxPrice = effectiveFilters.priceRange[1];
      if (effectiveFilters.starRating > 0) {
        // 注意：模拟数据中没有星级字段，实际项目中会有
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
      setHasMore(data.length === 10);
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
      starRating: 0,
      sortBy: 'recommend',
    });
    setDraftPriceRange(DEFAULT_PRICE_RANGE);
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

  const handleDraftMinChange = (e: any) => {
    const v = Number(e.detail.value);
    setDraftPriceRange(prev => [v, prev[1] < v ? v : prev[1]]);
  };
  const handleDraftMaxChange = (e: any) => {
    const v = Number(e.detail.value);
    setDraftPriceRange(prev => [prev[0] > v ? v : prev[0], v]);
  };
  const applyDraftPrice = () => {
    setFilters(prev => ({ ...prev, priceRange: draftPriceRange }));
    setShowPriceModal(false);
    loadHotels(true, undefined, { ...filters, priceRange: draftPriceRange });
  };
  
  // 星级显示文本
  const starText = filters.starRating === 0 
    ? '不限' 
    : starOptions.find(opt => opt.value === filters.starRating)?.label || '不限';
  
  // 排序显示文本
  const sortText = sortOptions.find(opt => opt.value === filters.sortBy)?.label || '推荐排序';

  return (
    <View className="list-page">
      {/* 筛选面板 */}
      <View className="filter-panel">
        <View className="filter-row">
          <View className="filter-item" onClick={() => { setDraftPriceRange(filters.priceRange); setShowPriceModal(true); }}>
            <Text className="filter-label">价格</Text>
            <Text className="filter-value">{priceRangeText}</Text>
          </View>
          
          <View className="filter-item">
            <Text className="filter-label">星级</Text>
            <Picker
              mode="selector"
              range={starOptions.map(opt => opt.label)}
              value={starOptions.findIndex(opt => opt.value === filters.starRating)}
              onChange={(e) => handleFilterChange('starRating', starOptions[e.detail.value].value)}
            >
              <Text className="filter-value">{starText}</Text>
            </Picker>
          </View>
          
          <View className="filter-item">
            <Text className="filter-label">排序</Text>
            <Picker
              mode="selector"
              range={sortOptions.map(opt => opt.label)}
              value={sortOptions.findIndex(opt => opt.value === filters.sortBy)}
              onChange={(e) => handleFilterChange('sortBy', sortOptions[e.detail.value].value)}
            >
              <Text className="filter-value">{sortText}</Text>
            </Picker>
          </View>
        </View>
        
        <View className="filter-actions">
          <View className="filter-button reset" onClick={resetFilters}>
            <Text className="filter-button-text">重置</Text>
          </View>
          <View className="filter-button apply" onClick={applyFilters}>
            <Text className="filter-button-text">应用</Text>
          </View>
        </View>
      </View>

      {/* 价格筛选弹窗（双滑块） */}
      {showPriceModal && (
        <View className="price-modal-mask">
          <View className="price-modal-overlay" onClick={() => setShowPriceModal(false)} />
          <View className="price-modal-panel">
            <View className="price-modal-header">
              <Text className="price-modal-title">价格区间</Text>
              <View className="price-modal-close" onClick={() => setShowPriceModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="price-modal-body">
              <Text className="price-modal-range">
                ¥{draftPriceRange[0]} - ¥{draftPriceRange[1] >= PRICE_MAX ? '500+' : draftPriceRange[1]}
              </Text>
              <View className="price-modal-sliders">
                <View className="price-slider-row">
                  <Text className="price-slider-min">¥0</Text>
                  <Slider
                    className="price-slider"
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
                <View className="price-slider-row">
                  <Text className="price-slider-min">¥{draftPriceRange[1] >= PRICE_MAX ? '500+' : draftPriceRange[1]}</Text>
                  <Slider
                    className="price-slider"
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
              <View className="price-quick-row">
                {priceQuickOptions.map(opt => (
                  <View
                    key={opt.label}
                    className="price-quick-btn"
                    onClick={() => setDraftPriceRange([opt.value[0], opt.value[1]])}
                  >
                    <Text>{opt.label}</Text>
                  </View>
                ))}
              </View>
              <View className="price-modal-actions">
                <View className="price-action cancel" onClick={() => setShowPriceModal(false)}>
                  <Text className="price-action-text">取消</Text>
                </View>
                <View className="price-action ok" onClick={applyDraftPrice}>
                  <Text className="price-action-text">确定</Text>
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
    </View>
  );
};

export default ListPage;