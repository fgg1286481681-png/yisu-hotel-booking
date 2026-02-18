import React, { useState, useEffect } from 'react';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import { Hotel } from '../../../shared/api';
import './detail.css';

const DetailPage: React.FC = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟数据 - 将在Phase 3中替换为真实数据
  const mockHotel: Hotel = {
    id: 1,
    name: '北京王府井大酒店',
    address: '北京市东城区王府井大街',
    price: 580,
    rating: 4.5,
    image: 'https://example.com/hotel1.jpg',
    city: '北京',
    facilities: ['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室']
  };

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setHotel(mockHotel);
      setLoading(false);
    }, 500);
  }, []);

  const handleBookClick = () => {
    console.log('预订酒店:', hotel);
    // 将在Phase 3中实现预订流程
  };

  if (loading) {
    return (
      <View className="loading-container">
        <Text className="loading-text">加载中...</Text>
      </View>
    );
  }

  if (!hotel) {
    return (
      <View className="error-container">
        <Text className="error-text">酒店信息不存在</Text>
      </View>
    );
  }

  return (
    <View className="detail-page">
      {/* 轮播图区域 */}
      <Swiper
        className="hotel-swiper"
        indicatorDots
        indicatorColor="rgba(255, 255, 255, 0.6)"
        indicatorActiveColor="#fff"
        autoplay
        circular
      >
        <SwiperItem>
          <Image className="swiper-image" src={hotel.image} mode="aspectFill" />
        </SwiperItem>
        <SwiperItem>
          <Image className="swiper-image" src="https://example.com/hotel1-2.jpg" mode="aspectFill" />
        </SwiperItem>
        <SwiperItem>
          <Image className="swiper-image" src="https://example.com/hotel1-3.jpg" mode="aspectFill" />
        </SwiperItem>
      </Swiper>

      {/* 酒店基本信息 */}
      <View className="hotel-info">
        <View className="hotel-header">
          <Text className="hotel-name">{hotel.name}</Text>
          <View className="hotel-rating">
            <Text className="rating-text">{hotel.rating}</Text>
            <Text className="rating-label">分</Text>
          </View>
        </View>

        <Text className="hotel-address">{hotel.address}</Text>

        <View className="price-section">
          <Text className="price-label">今日价格</Text>
          <Text className="price-amount">¥{hotel.price}</Text>
          <Text className="price-unit">/晚</Text>
        </View>
      </View>

      {/* 设施区域 */}
      <View className="facilities-section">
        <Text className="section-title">酒店设施</Text>
        <View className="facilities-grid">
          {hotel.facilities.map((facility, index) => (
            <View key={index} className="facility-item">
              <Text className="facility-text">{facility}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 房型选择区域 - 将在Phase 3中实现 */}
      <View className="room-types-section">
        <Text className="section-title">房型选择</Text>
        <Text className="placeholder-text">房型选择功能将在Phase 3中实现</Text>
      </View>

      {/* 价格日历区域 - 将在Phase 3中实现 */}
      <View className="calendar-section">
        <Text className="section-title">价格日历</Text>
        <Text className="placeholder-text">价格日历联动功能将在Phase 3中实现</Text>
      </View>

      {/* 底部预订栏 */}
      <View className="bottom-bar">
        <View className="bottom-price">
          <Text className="bottom-price-label">¥{hotel.price}</Text>
          <Text className="bottom-price-unit">/晚起</Text>
        </View>
        <View className="book-button" onClick={handleBookClick}>
          <Text className="book-button-text">立即预订</Text>
        </View>
      </View>
    </View>
  );
};

export default DetailPage;