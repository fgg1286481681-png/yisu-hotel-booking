import React, { useState, useEffect } from 'react';
import { View, Text, Image, Swiper, SwiperItem, Picker, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getCities, getHotels, Hotel, HotelQueryParams } from '../../../../shared/api';
import './index.css';

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

// 地点推荐数据
const locationRecommendations = [
  { id: 1, name: '故宫', distance: '2.5km', type: '文化古迹' },
  { id: 2, name: '天安门', distance: '3.1km', type: '地标建筑' },
  { id: 3, name: '王府井', distance: '1.8km', type: '商业中心' },
  { id: 4, name: '颐和园', distance: '12km', type: '公园景区' },
];

// 分类导航数据
const categoryNavs = [
  { id: 1, name: '口碑榜', icon: '⭐', color: '#ff6b6b' },
  { id: 2, name: '附近热卖', icon: '🔥', color: '#ffa726' },
  { id: 3, name: '超值低价', icon: '💰', color: '#66bb6a' },
];

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
  const [cities, setCities] = useState<string[]>([]);
  const [nearbyHotels, setNearbyHotels] = useState<Hotel[]>([]);

  // 初始化数据
  useEffect(() => {
    loadInitialData();
    getCurrentLocation();
  }, []);

  const loadInitialData = async () => {
    try {
      const cityList = await getCities();
      setCities(cityList);
      
      // 加载附近酒店
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

  return (
    <ScrollView className="index-page" scrollY>
      {/* 1. 广告轮播板块 */}
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

      {/* 2. 住房分类板块 */}
      <View className="accommodation-section">
        <Text className="section-title">住宿类型</Text>
        <View className="domestic-foreign">
          <View 
            className={`tab ${isDomestic ? 'active' : ''}`}
            onClick={() => setIsDomestic(true)}
          >
            <Text>国内</Text>
          </View>
          <View 
            className={`tab ${!isDomestic ? 'active' : ''}`}
            onClick={() => setIsDomestic(false)}
          >
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
              <Text className="type-icon">{type.icon}</Text>
              <Text className="type-name">{type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. 城市选择和定位板块 */}
      <View className="location-section">
        <Text className="section-title">目的地</Text>
        <View className="location-controls">
          <View className="city-picker">
            <Picker 
              mode="selector" 
              range={cities}
              onChange={handleCityChange}
            >
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
        <Text className="location-address">{location.address}</Text>
      </View>

      {/* 4. 日期选择板块 */}
      <View className="date-section">
        <Text className="section-title">入住时间</Text>
        <View className="date-controls">
          <View className="date-input">
            <Text className="date-label">入住</Text>
            <Picker 
              mode="date" 
              value={checkInDate}
              onChange={handleCheckInDateChange}
            >
              <Text className="date-value">{checkInDate}</Text>
            </Picker>
          </View>
          
          <View className="date-input">
            <Text className="date-label">离店</Text>
            <Picker 
              mode="date" 
              value={checkOutDate}
              onChange={handleCheckOutDateChange}
            >
              <Text className="date-value">{checkOutDate}</Text>
            </Picker>
          </View>
          
          <View className="nights-display">
            <Text className="nights-label">住</Text>
            <Text className="nights-count">{nights}</Text>
            <Text className="nights-label">晚</Text>
          </View>
        </View>
      </View>

      {/* 5. 价格和星级筛选板块 */}
      <View className="filter-section">
        <Text className="section-title">筛选条件</Text>
        
        <View className="price-filter">
          <Text className="filter-label">价格区间: ¥{priceRange[0]} - ¥{priceRange[1]}</Text>
          {/* 这里应该使用Slider组件，但Taro的Slider在微信小程序中表现不一致 */}
          <View className="price-range-display">
            <View className="range-track">
              <View 
                className="range-fill" 
                style={{ width: `${((priceRange[1] - 100) / 900) * 100}%` }}
              />
            </View>
            <Text className="range-min">¥100</Text>
            <Text className="range-max">¥1000</Text>
          </View>
        </View>
        
        <View className="star-filter">
          <Text className="filter-label">酒店星级</Text>
          <View className="star-buttons">
            {[1, 2, 3, 4, 5].map(star => (
              <View
                key={star}
                className={`star-button ${starRating >= star ? 'active' : ''}`}
                onClick={() => handleStarRatingChange(star)}
              >
                <Text className="star-icon">⭐</Text>
                <Text className="star-text">{star}星{star === 5 ? '+' : ''}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 6. 地点推荐板块 */}
      <View className="recommendation-section">
        <Text className="section-title">附近推荐</Text>
        <View className="recommendation-grid">
          {locationRecommendations.map(loc => (
            <View 
              key={loc.id}
              className="recommendation-item"
              onClick={() => handleLocationClick(loc.id)}
            >
              <Text className="rec-name">{loc.name}</Text>
              <Text className="rec-distance">{loc.distance}</Text>
              <Text className="rec-type">{loc.type}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 7. 查询按钮 */}
      <View className="search-button-section">
        <Button className="search-button" onClick={handleSearch}>
          <Text className="search-button-text">立即查询</Text>
        </Button>
      </View>

      {/* 8. 优惠信息板块 */}
      <View className="promotion-section" onClick={handlePromotionClick}>
        <Text className="promotion-title">🎁 专属优惠</Text>
        <Text className="promotion-desc">点击查看APP专属优惠，限时特惠！</Text>
        <Text className="promotion-hint">仅限APP内查看</Text>
      </View>

      {/* 9. 分类导航板块 */}
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
            <View key={hotel.id} className="hotel-card">
              <Image className="hotel-image" src={hotel.image} mode="aspectFill" />
              <View className="hotel-info">
                <Text className="hotel-name" numberOfLines={1}>{hotel.name}</Text>
                <Text className="hotel-distance">距您 {Math.floor(Math.random() * 10) + 1}km</Text>
                <Text className="hotel-location">{hotel.city}</Text>
                <View className="hotel-price">
                  <Text className="price-symbol">¥</Text>
                  <Text className="price-amount">{hotel.price}</Text>
                  <Text className="price-unit">起</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
};

export default IndexPage;