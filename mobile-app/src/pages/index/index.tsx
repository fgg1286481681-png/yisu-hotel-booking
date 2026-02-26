import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Swiper, SwiperItem, Picker, Button, ScrollView, Slider } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getHotels, Hotel, HotelQueryParams } from '../../services/unifiedApi';
import Calendar from '../../components/Calendar';
import './index.css';
import NearbyHotelCard from '../../components/NearbyHotelCard';

// 广告图片数据
const adImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
];

// 住房类型数据
const accommodationTypes = [
  { id: 1, name: '酒店', icon: '🏨' },
  { id: 2, name: '民宿', icon: '🏡' },
  { id: 3, name: '公寓', icon: '🏢' },
  { id: 4, name: '度假村', icon: '🌴' },
];

// 地点推荐数据（地标更丰富，便于滑动验证）
const locationRecommendations = [
  { id: 1, name: '故宫', distance: '2.5km', type: '文化古迹' },
  { id: 2, name: '天安门', distance: '3.1km', type: '地标建筑' },
  { id: 3, name: '王府井', distance: '1.8km', type: '商业中心' },
  { id: 4, name: '颐和园', distance: '12km', type: '公园景区' },
  { id: 5, name: '清华大学', distance: '15km', type: '高校' },
  { id: 6, name: '北京大学', distance: '16km', type: '高校' },
  { id: 7, name: '中国人民大学', distance: '14km', type: '高校' },
  { id: 8, name: '国贸中心', distance: '6km', type: '商务区' },
  { id: 9, name: '金融街', distance: '7km', type: '金融区' },
  { id: 10, name: '招商银行国贸支行', distance: '6.5km', type: '银行' },
  { id: 11, name: '建设银行建国门支行', distance: '5.8km', type: '银行' },
  { id: 12, name: '北京站', distance: '4.2km', type: '交通枢纽' },
  { id: 13, name: '北京西站', distance: '10.3km', type: '交通枢纽' },
  { id: 14, name: '首都机场T3航站楼', distance: '28km', type: '机场' },
];

// 分类导航数据
const categoryNavs = [
  { id: 1, name: '口碑榜', icon: '⭐', color: '#ff6b6b' },
  { id: 2, name: '附近热卖', icon: '🔥', color: '#ffa726' },
  { id: 3, name: '超值低价', icon: '💰', color: '#66bb6a' },
];

// 国内城市列表
const domesticCities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '武汉', '西安', '南京'];
// 国外城市列表
const foreignCities = ['东京', '首尔', '新加坡', '曼谷', '巴黎', '伦敦', '纽约', '悉尼', '迪拜', '洛杉矶'];

// 价格区间快捷选项（与list页面保持一致）
const priceQuickOptions = [
  { label: '¥0-200', value: [0, 200] },
  { label: '¥200-300', value: [200, 300] },
  { label: '¥300-500', value: [300, 500] },
  { label: '¥500以上', value: [500, 600] },
];

const PRICE_MAX = 600; // 滑块最大值，表示 500+

const IndexPage: React.FC = () => {
  // 状态管理
  const [location, setLocation] = useState({ city: '北京', address: '正在定位...' });
  const [isDomestic, setIsDomestic] = useState(true);
  const [selectedType, setSelectedType] = useState(1);
  const [checkInDate, setCheckInDate] = useState('2024-02-20');
  const [checkOutDate, setCheckOutDate] = useState('2024-02-22');
  const [nights, setNights] = useState(2);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // 默认为不限价格
  const [starRating, setStarRating] = useState<number[]>([]); // 默认为不限星级（空数组）
  const [nearbyHotels, setNearbyHotels] = useState<Hotel[]>([]);

  // 新增状态
  const [isHourlyRoom, setIsHourlyRoom] = useState(false);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [showPriceStarModal, setShowPriceStarModal] = useState(false);
  const [selectedPriceOption, setSelectedPriceOption] = useState<number | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);

  // 日历组件状态
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'range' | 'single'>('range');

  // 城市选择模态窗口状态
  const [showCityModal, setShowCityModal] = useState(false);

  // 国内/国外切换时使用对应城市列表
  const cities = useMemo(() => (isDomestic ? domesticCities : foreignCities), [isDomestic]);

  // 初始化数据（获取定位）
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // 切换国内/国外时，若当前城市不在新列表中则重置为列表第一项
  useEffect(() => {
    const list = isDomestic ? domesticCities : foreignCities;
    if (!list.includes(location.city)) {
      setLocation(prev => ({ ...prev, city: list[0] || '北京' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅随 isDomestic 切换时同步城市
  }, [isDomestic]);

  // 切换住宿/钟点房时，清除相应的日期状态
  useEffect(() => {
    if (isHourlyRoom) {
      // 切换到钟点房模式，清除离店日期，将晚数设为0
      setNights(0);
      // 保留入住日期作为钟点房日期
    } else {
      // 切换到住宿模式，如果没有离店日期，设置默认离店日期（入住日期+1天）
      if (!checkOutDate || checkOutDate === checkInDate) {
        const inDate = new Date(checkInDate);
        const outDate = new Date(inDate);
        outDate.setDate(outDate.getDate() + 1);
        const outDateStr = outDate.toISOString().split('T')[0];
        setCheckOutDate(outDateStr);

        // 计算住几晚
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
      }
    }
  }, [isHourlyRoom]);

  // 根据当前选中的城市加载附近酒店
  useEffect(() => {
    const loadNearbyHotels = async () => {
      try {
        // 先拿到后端 / mock 返回的所有酒店，然后在前端再按城市筛一遍，保证只显示当前城市
        const hotels = await getHotels();
        const filtered = hotels.filter((hotel: any) => hotel.city === location.city);
        setNearbyHotels(filtered.slice(0, 6)); // 只展示前 6 个
      } catch (error) {
        console.error('加载附近酒店失败:', error);
      }
    };

    loadNearbyHotels();
  }, [location.city]);

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

  // 处理城市选择
  const handleCityChange = (e: any) => {
    const city = cities[e.detail.value];
    setLocation({ ...location, city });
  };

  // 处理日期选择
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

  // 处理星级选择（多选）
  const handleStarRatingChange = (rating: number) => {
    setStarRating(prev => {
      if (prev.includes(rating)) {
        // 如果已经选中，则移除
        return prev.filter(r => r !== rating);
      } else {
        // 如果未选中，则添加
        return [...prev, rating];
      }
    });
  };

  // 处理酒店点击，跳转到详情页
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

  // 执行搜索
  const handleSearch = () => {
    const params: HotelQueryParams = {
      city: location.city,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    };

    // 只有当价格范围不是默认值[0,1000]时才传递价格筛选
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) {
      params.minPrice = priceRange[0];
      // 如果最大值是 600（代表500以上），则不限制最大价格
      if (priceRange[1] < PRICE_MAX) {
        params.maxPrice = priceRange[1];
      }
    }

    // 只有当用户选择了星级时才传递星级筛选（空数组表示不限）
    if (starRating.length > 0) {
      // 将数组转换为逗号分隔的字符串，如 "4,5"
      params.starRating = starRating.join(',');
    }

    // 构建URL参数
    const urlParams = new URLSearchParams();
    if (params.city) urlParams.set('city', params.city);
    if (params.checkIn) urlParams.set('checkIn', params.checkIn);
    if (params.checkOut) urlParams.set('checkOut', params.checkOut);
    if (params.minPrice !== undefined) urlParams.set('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) urlParams.set('maxPrice', String(params.maxPrice));
    if (params.starRating) urlParams.set('starRating', params.starRating);

    Taro.navigateTo({
      url: `/pages/list/list?${urlParams.toString()}`,
    });
  };

  // 处理地点推荐点击
  const handleLocationClick = (locationId: number) => {
    Taro.navigateTo({
      url: `/pages/list/list?nearby=${locationId}`,
    });
  };

  // 处理分类导航点击
  const handleCategoryClick = (categoryId: number) => {
    let url = '/pages/list/list?';
    switch (categoryId) {
      case 1: url += 'sort=rating'; break; // 口碑榜
      case 2: url += 'sort=hot'; break;    // 附近热卖
      case 3: url += 'sort=price_low'; break; // 超值低价
    }
    Taro.navigateTo({ url });
  };

  // 处理搜索框点击，跳转到search页面
  const handleSearchBoxClick = () => {
    Taro.navigateTo({
      url: '/pages/search/search',
    });
  };

  // 处理优惠信息点击
  const handlePromotionClick = () => {
    Taro.showModal({
      title: '优惠信息',
      content: '此优惠仅限在易宿APP内查看和使用，请下载最新版APP享受专属优惠！',
      showCancel: false,
    });
  };

  const handlePriceMinChange = (e: any) => {
    const v = Number(e.detail.value);
    setPriceRange(prev => [v, prev[1] < v ? v : prev[1]]);
    setSelectedPriceOption(null); // 清除选中的快捷价格选项
  };
  const handlePriceMaxChange = (e: any) => {
    const v = Number(e.detail.value);
    setPriceRange(prev => [prev[0] > v ? v : prev[0], v]);
    setSelectedPriceOption(null); // 清除选中的快捷价格选项
  };
  const applyQuickPrice = (value: [number, number], index: number) => {
    setPriceRange([value[0], value[1]]);
    setSelectedPriceOption(index);
  };

  // 清除价格和星级筛选
  const handleClearPriceStar = () => {
    setPriceRange([0, 1000]); // 重置为不限价格
    setStarRating([]); // 重置为不限星级（空数组）
    setSelectedPriceOption(null); // 清除选中的快捷价格选项
  };

  // 确认价格和星级筛选
  const handleConfirmPriceStar = () => {
    setShowPriceStarModal(false);
  };

  // 处理日历选择
  const handleDateSelect = (value: string | [string, string]) => {
    if (calendarMode === 'range' && Array.isArray(value)) {
      const [startDate, endDate] = value;
      setCheckInDate(startDate);
      setCheckOutDate(endDate);

      // 计算住几晚
      const inDate = new Date(startDate);
      const outDate = new Date(endDate);
      const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    } else if (calendarMode === 'single' && typeof value === 'string') {
      setCheckInDate(value);
    }
    setShowCalendar(false);
  };

  // 打开日历
  const handleOpenCalendar = () => {
    setCalendarMode(isHourlyRoom ? 'single' : 'range');
    setShowCalendar(true);
  };

  // 处理广告图片点击，跳转到酒店详情页
  const handleAdClick = (index: number) => {
    // 三个北京酒店的ID，可以根据实际情况调整
    const hotelIds = [1, 2, 3]; // 假设的酒店ID
    const hotelId = hotelIds[index % hotelIds.length]; // 循环使用酒店ID

    const params = {
      id: hotelId.toString(),
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

  return (
    <View className="index-page">
      <ScrollView className="index-scroll" scrollY>
        <View className="ad-section">
          <Swiper
            className="ad-swiper"
            indicatorDots
            indicatorColor="rgba(255, 255, 255, 0.6)"
            indicatorActiveColor="#fff"
            autoplay
            circular
          >
            {adImages.map((img, index) => (
              <SwiperItem key={index} onClick={() => handleAdClick(index)}>
                <Image className="ad-image" src={img} mode="aspectFill" />
              </SwiperItem>
            ))}
          </Swiper>
        </View>

        {/* 查询板块：白底、不铺满、紧凑表格式、栏间距为 0 */}
        <View className="query-panel">
          <View className="query-row accommodation-section">
            <View className="domestic-foreign">
              <View className={`tab ${isDomestic ? 'active' : ''}`} onClick={() => setIsDomestic(true)}>
                <Text>国内</Text>
              </View>
              <View className={`tab ${!isDomestic ? 'active' : ''}`} onClick={() => setIsDomestic(false)}>
                <Text>国外</Text>
              </View>
            </View>
            <View className="type-grid">
              {accommodationTypes.map(type => (
                <View
                  key={type.id}
                  className={`type-item ${selectedType === type.id ? 'selected' : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <Text className="type-name">{type.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="query-row location-section">
            <View className="city-picker" onClick={() => setShowCityModal(true)}>
              <View className="picker-content">
                <Text className="city-name">{location.city}</Text>
                <Text className="picker-arrow">▼</Text>
              </View>
            </View>
            <View className="search-box" onClick={handleSearchBoxClick}>
              <Text className="search-icon">🔍</Text>
              <Text className="search-placeholder">位置/品牌/酒店</Text>
            </View>
            <View className="gps-button" onClick={getCurrentLocation}>
              <Text className="gps-icon">📍</Text>
              <Text className="gps-text">定位</Text>
            </View>
          </View>

          <View className="query-row date-section">
            <View className="hourly-tabs">
              <View className={`hourly-tab ${!isHourlyRoom ? 'active' : ''}`} onClick={() => setIsHourlyRoom(false)}>
                <Text>住宿</Text>
              </View>
              <View className={`hourly-tab ${isHourlyRoom ? 'active' : ''}`} onClick={() => setIsHourlyRoom(true)}>
                <Text>钟点房</Text>
              </View>
            </View>
            {isHourlyRoom ? (
              <View className="date-single" onClick={handleOpenCalendar}>
                <Text className="date-value">{checkInDate}</Text>
              </View>
            ) : (
              <View className="date-controls">
                <View className="date-input" onClick={handleOpenCalendar}>
                  <Text className="date-value">{checkInDate}</Text>
                </View>
                <View className="date-input" onClick={handleOpenCalendar}>
                  <Text className="date-value">{checkOutDate}</Text>
                </View>
                <View className="nights-display">
                  <Text className="nights-count">{nights}</Text>
                  <Text className="nights-label">晚</Text>
                </View>
              </View>
            )}
          </View>

          <View className="query-row guests-price-row">
            <View className="guests-block" onClick={() => setShowRoomModal(true)}>
              <View className="guest-item">
                <Text className="guest-label">房间</Text>
                <Text className="guest-value">{roomCount}间</Text>
              </View>
              <View className="guest-item">
                <Text className="guest-label">成人</Text>
                <Text className="guest-value">{adultCount}人</Text>
              </View>
              <View className="guest-item">
                <Text className="guest-label">儿童</Text>
                <Text className="guest-value">{childCount}人</Text>
              </View>
            </View>
            <View
              className={`price-star-trigger ${priceRange[0] !== 0 || priceRange[1] !== 1000 || starRating.length > 0 ? 'active' : ''}`}
              onClick={() => setShowPriceStarModal(true)}
            >
              <Text className="price-star-placeholder">
                {priceRange[0] !== 0 || priceRange[1] !== 1000
                  ? (priceRange[1] >= PRICE_MAX
                      ? `¥${priceRange[0]}+`
                      : `¥${priceRange[0]}-${priceRange[1]}`)
                  : ''}
                {priceRange[0] !== 0 || priceRange[1] !== 1000 ? ' ' : ''}
                {starRating.length > 0 ? `${starRating.join(',')}星` : ''}
                {priceRange[0] === 0 && priceRange[1] === 1000 && starRating.length === 0 ? '价格/星级' : ''}
              </Text>
            </View>
          </View>

          <View className="query-row recommendation-section">
            <ScrollView className="recommendation-scroll" scrollX>
              <View className="recommendation-scroll-inner">
                {locationRecommendations.map(loc => (
                  <View key={loc.id} className="recommendation-chip" onClick={() => handleLocationClick(loc.id)}>
                    <Text className="rec-name">{loc.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="query-row search-button-section">
            <Button className="search-button" onClick={handleSearch}>
              <Text className="search-button-text">立即查询</Text>
            </Button>
          </View>
        </View>

        <View className="promotion-section" onClick={handlePromotionClick}>
          <Text className="promotion-title">🎁 专属优惠</Text>
          <Text className="promotion-desc">点击查看APP专属优惠，限时特惠！</Text>
          <Text className="promotion-hint">仅限APP内查看</Text>
        </View>

        <View className="category-section">
        {categoryNavs.map(cat => (
          <View
            key={cat.id}
            className="category-item"
            onClick={() => handleCategoryClick(cat.id)}
            style={{ backgroundColor: cat.color }}
          >
            <Text className="category-icon">{cat.icon}</Text>
            <Text className="category-name">{cat.name}</Text>
          </View>
        ))}
      </View>

      {/* 10. 附近酒店展示板块 */}
      <View className="hotels-section">
        <View className="section-header">
          <Text className="section-title">附近酒店</Text>
          <Text
            className="view-all"
            onClick={() => Taro.navigateTo({ url: '/pages/list/list' })}
          >
            查看全部 ›
          </Text>
        </View>

        <View className="hotels-grid">
          {nearbyHotels.map(hotel => (
            <NearbyHotelCard
              key={hotel.id}
              hotel={hotel}
              onClick={() => handleHotelClick(hotel)}
            />
          ))}
        </View>
      </View>

      </ScrollView>

      {/* 价格/星级伪弹窗：上半透明遮罩，下半为面板，点 X 或上方透明区域关闭 */}
      {showPriceStarModal && (
        <View className="price-star-modal-mask">
          <View className="price-star-modal-overlay" onClick={() => setShowPriceStarModal(false)} />
          <View className="price-star-modal-panel">
            <View className="price-star-modal-header">
              <Text className="price-star-modal-title">价格 / 星级</Text>
              <View className="price-star-modal-close" onClick={() => setShowPriceStarModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="price-star-modal-body">
              <View className="modal-price-block">
                <Text className="modal-price-label">价格区间：¥{priceRange[0]} - ¥{priceRange[1] >= PRICE_MAX ? '500+' : priceRange[1]}</Text>
                <View className="modal-sliders">
                  <View className="modal-slider-row">
                    <Text className="modal-slider-min">¥{priceRange[0]}</Text>
                    <Slider
                      className="modal-slider"
                      min={0}
                      max={500}
                      value={priceRange[0]}
                      onChanging={handlePriceMinChange}
                      onChange={handlePriceMinChange}
                      blockSize={24}
                      backgroundColor="#f0f0f0"
                      activeColor="#1890ff"
                    />
                  </View>
                  <View className="modal-slider-row">
                    <Text className="modal-slider-min">¥{priceRange[1] >= PRICE_MAX ? '500+' : priceRange[1]}</Text>
                    <Slider
                      className="modal-slider"
                      min={1}
                      max={500}
                      value={priceRange[1]}
                      onChanging={handlePriceMaxChange}
                      onChange={handlePriceMaxChange}
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
                      onClick={() => applyQuickPrice([opt.value[0], opt.value[1]], i)}
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
                      className={`modal-star-btn ${starRating.includes(star) ? 'active' : ''}`}
                      onClick={() => handleStarRatingChange(star)}
                    >
                      <Text>⭐ {star}星</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className="modal-button-group">
                <View className="modal-button clear-button" onClick={handleClearPriceStar}>
                  <Text>清除</Text>
                </View>
                <View className="modal-button confirm-button" onClick={handleConfirmPriceStar}>
                  <Text>确定</Text>
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

      {/* 日历组件 */}
      <Calendar
        mode={calendarMode}
        value={calendarMode === 'range' ? [checkInDate, checkOutDate] : checkInDate}
        onChange={handleDateSelect}
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

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
              <View className="city-modal-tabs">
                <View
                  className={`city-modal-tab ${isDomestic ? 'active' : ''}`}
                  onClick={() => setIsDomestic(true)}
                >
                  <Text>国内</Text>
                </View>
                <View
                  className={`city-modal-tab ${!isDomestic ? 'active' : ''}`}
                  onClick={() => setIsDomestic(false)}
                >
                  <Text>国外</Text>
                </View>
              </View>
              <ScrollView className="city-list-scroll" scrollY>
                <View className="city-list">
                  {cities.map((city, index) => (
                    <View
                      key={city}
                      className={`city-item ${location.city === city ? 'selected' : ''}`}
                      onClick={() => {
                        setLocation({ ...location, city });
                        setShowCityModal(false);
                      }}
                    >
                      <Text className={`city-item-text ${location.city === city ? 'selected' : ''}`}>{city}</Text>
                      {location.city === city && (
                        <Text className="city-item-check">✓</Text>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default IndexPage;
