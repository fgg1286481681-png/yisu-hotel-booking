import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Swiper, SwiperItem, Picker, Button, ScrollView, Slider } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getHotels, Hotel, HotelQueryParams } from '../../../../shared/api';
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

// 价格区间快捷选项（0~500+）
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
  const [priceRange, setPriceRange] = useState([200, 800]);
  const [starRating, setStarRating] = useState(3);
  const [nearbyHotels, setNearbyHotels] = useState<Hotel[]>([]);

  // 新增状态
  const [isHourlyRoom, setIsHourlyRoom] = useState(false);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [showPriceStarModal, setShowPriceStarModal] = useState(false);

  // 国内/国外切换时使用对应城市列表
  const cities = useMemo(() => (isDomestic ? domesticCities : foreignCities), [isDomestic]);

  // 初始化数据
  useEffect(() => {
    loadInitialData();
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

  const loadInitialData = async () => {
    try {
      const hotels = await getHotels({ city: '北京', limit: 6 });
      setNearbyHotels(hotels);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

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

  // 处理星级选择
  const handleStarRatingChange = (rating: number) => {
    setStarRating(rating);
  };

  // 执行搜索
  const handleSearch = () => {
    const params: HotelQueryParams = {
      city: location.city,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };

    Taro.navigateTo({
      url: `/pages/list/list?${new URLSearchParams(params as any).toString()}`,
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
  };
  const handlePriceMaxChange = (e: any) => {
    const v = Number(e.detail.value);
    setPriceRange(prev => [prev[0] > v ? v : prev[0], v]);
  };
  const applyQuickPrice = (value: [number, number]) => setPriceRange([value[0], value[1]]);

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
              <SwiperItem key={index}>
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
            <View className="city-picker">
              <Picker mode="selector" range={cities} onChange={handleCityChange}>
                <View className="picker-content">
                  <Text className="city-name">{location.city}</Text>
                  <Text className="picker-arrow">▼</Text>
                </View>
              </Picker>
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
              <View className="date-single">
                <Picker mode="date" value={checkInDate} onChange={handleCheckInDateChange}>
                  <Text className="date-value">{checkInDate}</Text>
                </Picker>
              </View>
            ) : (
              <View className="date-controls">
                <View className="date-input">
                  <Picker mode="date" value={checkInDate} onChange={handleCheckInDateChange}>
                    <Text className="date-value">{checkInDate}</Text>
                  </Picker>
                </View>
                <View className="date-input">
                  <Picker mode="date" value={checkOutDate} onChange={handleCheckOutDateChange}>
                    <Text className="date-value">{checkOutDate}</Text>
                  </Picker>
                </View>
                <View className="nights-display">
                  <Text className="nights-count">{nights}</Text>
                  <Text className="nights-label">晚</Text>
                </View>
              </View>
            )}
          </View>

          <View className="query-row guests-price-row">
            <View className="guests-block">
              <View className="guest-item">
                <Text className="guest-label">房间</Text>
                <Picker mode="selector" range={['1间', '2间', '3间', '4间', '5间']} value={roomCount - 1} onChange={e => setRoomCount(Number(e.detail.value) + 1)}>
                  <Text className="guest-value">{roomCount}间</Text>
                </Picker>
              </View>
              <View className="guest-item">
                <Text className="guest-label">成人</Text>
                <Picker mode="selector" range={['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人']} value={adultCount - 1} onChange={e => setAdultCount(Number(e.detail.value) + 1)}>
                  <Text className="guest-value">{adultCount}人</Text>
                </Picker>
              </View>
              <View className="guest-item">
                <Text className="guest-label">儿童</Text>
                <Picker mode="selector" range={['0人', '1人', '2人', '3人', '4人', '5人']} value={childCount} onChange={e => setChildCount(Number(e.detail.value))}>
                  <Text className="guest-value">{childCount}人</Text>
                </Picker>
              </View>
            </View>
            <View className="price-star-trigger" onClick={() => setShowPriceStarModal(true)}>
              <Text className="price-star-placeholder">价格/星级</Text>
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
            <NearbyHotelCard key={hotel.id} hotel={hotel} />
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
                    <Text className="modal-slider-min">¥0</Text>
                    <Slider
                      className="modal-slider"
                      min={0}
                      max={PRICE_MAX}
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
                      min={0}
                      max={PRICE_MAX}
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
                      className="modal-quick-btn"
                      onClick={() => applyQuickPrice([opt.value[0], opt.value[1]])}
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
                      className={`modal-star-btn ${starRating === star ? 'active' : ''}`}
                      onClick={() => handleStarRatingChange(star)}
                    >
                      <Text>⭐ {star}星</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default IndexPage;
