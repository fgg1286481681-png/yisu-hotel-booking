import React, { useState, useEffect } from 'react';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Hotel, RoomType, getHotel } from '../../../../shared/api';
import Calendar from '../../components/Calendar';
import './detail.css';

const DetailPage: React.FC = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 日期和人数选择状态
  const [checkInDate, setCheckInDate] = useState('2024-02-20');
  const [checkOutDate, setCheckOutDate] = useState('2024-02-22');
  const [nights, setNights] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  
  // 模态窗口状态
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  
  // 获取URL参数
  useEffect(() => {
    const currentPage = Taro.getCurrentPages().pop();
    if (currentPage?.options) {
      const params = currentPage.options;
      const hotelId = params.id ? Number(params.id) : 1;
      
      // 从URL参数获取日期和人数信息
      if (params.checkIn) setCheckInDate(params.checkIn);
      if (params.checkOut) setCheckOutDate(params.checkOut);
      if (params.roomCount) setRoomCount(Number(params.roomCount));
      if (params.adultCount) setAdultCount(Number(params.adultCount));
      if (params.childCount) setChildCount(Number(params.childCount));
      
      // 计算住几晚
      if (params.checkIn && params.checkOut) {
        const inDate = new Date(params.checkIn);
        const outDate = new Date(params.checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
      }
      
      // 加载酒店数据
      loadHotelData(hotelId);
    } else {
      // 默认加载第一个酒店
      loadHotelData(1);
    }
  }, []);

  const loadHotelData = async (hotelId: number) => {
    setLoading(true);
    try {
      // 调用真实的API获取酒店数据
      const hotelData = await getHotel(hotelId);
      
      if (hotelData) {
        setHotel(hotelData);
      } else {
        // 如果API返回null，使用默认数据
        console.warn(`酒店ID ${hotelId} 不存在，使用默认数据`);
        const defaultHotel: Hotel = {
          id: hotelId,
          name: `酒店 ${hotelId}`,
          address: '地址信息',
          price: 500,
          rating: 4.0,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop'
          ],
          city: '北京',
          facilities: ['免费WiFi', '停车场', '餐厅'],
          starRating: 3,
          distance: 2.0,
          description: '酒店描述信息',
          phone: '010-12345678',
          roomTypes: [
            {
              id: 1,
              name: '标准大床房',
              description: '舒适的标准大床房',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
              tags: ['免费WiFi', '办公桌'],
              price: 500,
              originalPrice: 600,
              area: '25㎡',
              bedType: '大床',
              maxOccupancy: 2,
              breakfastIncluded: false,
              cancellationPolicy: '入住前24小时可免费取消'
            }
          ]
        };
        setHotel(defaultHotel);
      }
    } catch (error) {
      console.error('加载酒店数据失败:', error);
      // 显示错误信息
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理日期选择
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

  // 处理房间人数变化
  const handleRoomCountChange = (delta: number) => {
    setRoomCount(prev => Math.max(1, prev + delta));
  };

  const handleAdultCountChange = (delta: number) => {
    setAdultCount(prev => Math.max(1, prev + delta));
  };

  const handleChildCountChange = (delta: number) => {
    setChildCount(prev => Math.max(0, prev + delta));
  };

  // 处理预订点击
  const handleBookClick = () => {
    console.log('预订酒店:', hotel);
    console.log('入住日期:', checkInDate);
    console.log('离店日期:', checkOutDate);
    console.log('房间数:', roomCount);
    console.log('成人:', adultCount);
    console.log('儿童:', childCount);
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
      {/* 轮播图区域 - 使用真实的多张图片 */}
      <Swiper
        className="hotel-swiper"
        indicatorDots
        indicatorColor="rgba(255, 255, 255, 0.6)"
        indicatorActiveColor="#fff"
        autoplay
        circular
      >
        {hotel.images && hotel.images.length > 0 ? (
          hotel.images.map((image, index) => (
            <SwiperItem key={index}>
              <Image className="swiper-image" src={image} mode="aspectFill" />
            </SwiperItem>
          ))
        ) : (
          // 如果没有图片，使用默认图片
          <SwiperItem>
            <Image className="swiper-image" src={hotel.image} mode="aspectFill" />
          </SwiperItem>
        )}
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
        
        {hotel.description && (
          <Text className="hotel-description">{hotel.description}</Text>
        )}

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

      {/* 日历+人间夜Banner */}
      <View className="calendar-room-banner">
        <Text className="section-title">入住信息</Text>
        <View className="banner-content">
          <View className="date-selection" onClick={() => setShowCalendar(true)}>
            <View className="date-item">
              <Text className="date-label">入住</Text>
              <Text className="date-value">{checkInDate}</Text>
            </View>
            <View className="date-separator">
              <Text className="separator-text">{nights}晚</Text>
            </View>
            <View className="date-item">
              <Text className="date-label">离店</Text>
              <Text className="date-value">{checkOutDate}</Text>
            </View>
          </View>
          
          <View className="room-selection" onClick={() => setShowRoomModal(true)}>
            <Text className="room-label">房间/人数</Text>
            <Text className="room-value">{roomCount}间，{adultCount + childCount}人</Text>
          </View>
        </View>
      </View>

      {/* 房型价格列表 */}
      <View className="room-types-section">
        <Text className="section-title">房型选择</Text>
        {hotel.roomTypes && hotel.roomTypes.length > 0 ? (
          <View className="room-types-list">
            {hotel.roomTypes.map((roomType) => (
              <View key={roomType.id} className="room-type-card">
                <Image className="room-type-image" src={roomType.image} mode="aspectFill" />
                <View className="room-type-info">
                  <Text className="room-type-name">{roomType.name}</Text>
                  <Text className="room-type-description">{roomType.description}</Text>
                  
                  <View className="room-type-tags">
                    {roomType.tags.map((tag, index) => (
                      <View key={index} className="room-type-tag">
                        <Text className="tag-text">{tag}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View className="room-type-details">
                    {roomType.area && (
                      <Text className="room-type-detail">面积: {roomType.area}</Text>
                    )}
                    {roomType.bedType && (
                      <Text className="room-type-detail">床型: {roomType.bedType}</Text>
                    )}
                    {roomType.maxOccupancy && (
                      <Text className="room-type-detail">最多入住: {roomType.maxOccupancy}人</Text>
                    )}
                    {roomType.breakfastIncluded && (
                      <Text className="room-type-detail">含早餐</Text>
                    )}
                  </View>
                  
                  <View className="room-type-price">
                    {roomType.originalPrice && (
                      <Text className="room-type-original-price">¥{roomType.originalPrice}</Text>
                    )}
                    <Text className="room-type-current-price">¥{roomType.price}</Text>
                    <Text className="room-type-price-unit">/晚</Text>
                  </View>
                  
                  {roomType.cancellationPolicy && (
                    <Text className="room-type-cancellation">{roomType.cancellationPolicy}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text className="placeholder-text">暂无房型信息</Text>
        )}
      </View>

      {/* 日历组件 */}
      <Calendar
        mode="range"
        value={[checkInDate, checkOutDate]}
        onChange={handleDateSelect}
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

      {/* 房间人数选择模态窗口 */}
      {showRoomModal && (
        <View className="room-modal-mask">
          <View className="room-modal-overlay" onClick={() => setShowRoomModal(false)} />
          <View className="room-modal-panel">
            <View className="room-modal-header">
              <Text className="room-modal-title">选择房间和人数</Text>
              <View className="room-modal-close" onClick={() => setShowRoomModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            
            <View className="room-controls">
              <View className="room-control">
                <Text className="room-control-label">房间数</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => handleRoomCountChange(-1)}>
                    <Text>-</Text>
                  </View>
                  <Text className="room-control-value">{roomCount}间</Text>
                  <View className="room-control-button" onClick={() => handleRoomCountChange(1)}>
                    <Text>+</Text>
                  </View>
                </View>
              </View>
              
              <View className="room-control">
                <Text className="room-control-label">成人</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => handleAdultCountChange(-1)}>
                    <Text>-</Text>
                  </View>
                  <Text className="room-control-value">{adultCount}人</Text>
                  <View className="room-control-button" onClick={() => handleAdultCountChange(1)}>
                    <Text>+</Text>
                  </View>
                </View>
              </View>
              
              <View className="room-control">
                <Text className="room-control-label">儿童</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => handleChildCountChange(-1)}>
                    <Text>-</Text>
                  </View>
                  <Text className="room-control-value">{childCount}人</Text>
                  <View className="room-control-button" onClick={() => handleChildCountChange(1)}>
                    <Text>+</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View className="room-modal-footer">
              <View className="room-modal-button confirm" onClick={() => setShowRoomModal(false)}>
                <Text className="room-modal-button-text">确认</Text>
              </View>
            </View>
          </View>
        </View>
      )}

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