import React, { useEffect, useState } from 'react';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Hotel, createOrder, getHotel } from '../../services/unifiedApi';
import Calendar from '../../components/Calendar';
import './detail.css';

const DetailPage: React.FC = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [hotelId, setHotelId] = useState(1);
  const [checkInDate, setCheckInDate] = useState('2024-02-20');
  const [checkOutDate, setCheckOutDate] = useState('2024-02-22');
  const [nights, setNights] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  useEffect(() => {
    const currentPage = Taro.getCurrentPages().pop();
    const params = currentPage?.options || {};
    const nextHotelId = params.id ? Number(params.id) : 1;

    if (params.checkIn) setCheckInDate(params.checkIn);
    if (params.checkOut) setCheckOutDate(params.checkOut);
    if (params.roomCount) setRoomCount(Number(params.roomCount));
    if (params.adultCount) setAdultCount(Number(params.adultCount));
    if (params.childCount) setChildCount(Number(params.childCount));

    if (params.checkIn && params.checkOut) {
      const inDate = new Date(params.checkIn);
      const outDate = new Date(params.checkOut);
      const diffDays = Math.ceil(Math.abs(outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }

    setHotelId(nextHotelId);
  }, []);

  useEffect(() => {
    loadHotelData(hotelId);
  }, [hotelId, checkInDate, checkOutDate]);

  const loadHotelData = async (hotelId: number) => {
    setLoading(true);
    try {
      const hotelData = await getHotel(hotelId, true, { checkInDate, checkOutDate });
      if (hotelData) {
        setHotel(hotelData);
        setSelectedRoomTypeId(hotelData.roomTypes?.[0]?.id ?? null);
      } else {
        const defaultHotel: Hotel = {
          id: hotelId,
          name: `酒店 ${hotelId}`,
          address: '地址信息',
          price: 500,
          rating: 4.0,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
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
        setSelectedRoomTypeId(1);
      }
    } catch (error) {
      console.error('加载酒店数据失败:', error);
      Taro.showToast({ title: '加载失败，请重试', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const selectedRoomType = hotel?.roomTypes?.find((item) => item.id === selectedRoomTypeId) || hotel?.roomTypes?.[0] || null;

  const handleDateSelect = (value: string | [string, string]) => {
    if (Array.isArray(value)) {
      const [startDate, endDate] = value;
      setCheckInDate(startDate);
      setCheckOutDate(endDate);

      const inDate = new Date(startDate);
      const outDate = new Date(endDate);
      const diffDays = Math.ceil(Math.abs(outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
    setShowCalendar(false);
  };

  const handleRoomCountChange = (delta: number) => {
    setRoomCount((prev) => Math.max(1, prev + delta));
  };

  const handleAdultCountChange = (delta: number) => {
    setAdultCount((prev) => Math.max(1, prev + delta));
  };

  const handleChildCountChange = (delta: number) => {
    setChildCount((prev) => Math.max(0, prev + delta));
  };

  const handleBookClick = async () => {
    if (!hotel || !selectedRoomType) {
      Taro.showToast({ title: '请先选择房型', icon: 'none' });
      return;
    }

    try {
      const result = await createOrder({
        hotelId: hotel.id,
        roomTypeId: selectedRoomType.id,
        guestName: '游客',
        guestPhone: '13800000000',
        checkInDate,
        checkOutDate,
        roomCount,
        adultCount,
        childCount
      });

      Taro.showModal({
        title: '预订成功',
        content: `订单号：${result.order.orderNo}\n房型：${selectedRoomType.name}\n金额：¥${result.order.totalAmount}`,
        showCancel: false
      });
    } catch (error: any) {
      Taro.showToast({
        title: error?.message || '预订失败，请重试',
        icon: 'none'
      });
    }
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
      <Swiper className="hotel-swiper" indicatorDots indicatorColor="rgba(255, 255, 255, 0.6)" indicatorActiveColor="#fff" autoplay circular>
        {(hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image]).map((image, index) => (
          <SwiperItem key={index}>
            <Image className="swiper-image" src={image} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      <View className="hotel-info">
        <View className="hotel-header">
          <Text className="hotel-name">{hotel.name}</Text>
          <View className="hotel-rating">
            <Text className="rating-text">{hotel.rating}</Text>
            <Text className="rating-label">分</Text>
          </View>
        </View>

        {hotel.starRating ? (
          <View className="hotel-star-row">
            <Text className="star-badge">{hotel.starRating}星</Text>
            <Text className="star-text">{hotel.starRating}星级</Text>
          </View>
        ) : null}

        <Text className="hotel-address">{hotel.address}</Text>
        {hotel.description ? <Text className="hotel-description">{hotel.description}</Text> : null}

        <View className="price-section">
          <Text className="price-label">今日价格</Text>
          <Text className="price-amount">¥{selectedRoomType?.price ?? hotel.price}</Text>
          <Text className="price-unit">/晚</Text>
        </View>
      </View>

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

      <View className="room-types-section">
        <Text className="section-title">房型选择</Text>
        <View className="room-types-list">
          {hotel.roomTypes?.length ? hotel.roomTypes.map((roomType) => (
            <View
              key={roomType.id}
              className={`room-type-card ${selectedRoomTypeId === roomType.id ? 'selected' : ''}`}
              onClick={() => setSelectedRoomTypeId(roomType.id)}
            >
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
                  {roomType.area ? <Text className="room-type-detail">面积: {roomType.area}</Text> : null}
                  {roomType.bedType ? <Text className="room-type-detail">床型: {roomType.bedType}</Text> : null}
                  <Text className="room-type-detail">最多入住: {roomType.maxOccupancy}人</Text>
                </View>

                <View className="room-type-price">
                  {roomType.originalPrice ? <Text className="room-type-original-price">¥{roomType.originalPrice}</Text> : null}
                  <Text className="room-type-current-price">¥{roomType.price}</Text>
                  <Text className="room-type-price-unit">/晚</Text>
                </View>

                <Text className={`room-type-remaining ${(roomType.remainingRooms ?? 0) > 0 ? 'available' : 'sold-out'}`}>
                  {(roomType.remainingRooms ?? 0) > 0 ? `可订 ${roomType.remainingRooms} 间` : '该日期已售罄'}
                </Text>

                {roomType.cancellationPolicy ? (
                  <Text className="room-type-cancellation">{roomType.cancellationPolicy}</Text>
                ) : null}
              </View>
            </View>
          )) : <Text className="placeholder-text">暂无房型信息</Text>}
        </View>
      </View>

      <Calendar
        mode="range"
        value={[checkInDate, checkOutDate]}
        onChange={handleDateSelect}
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

      {showRoomModal ? (
        <View className="room-modal-mask">
          <View className="room-modal-overlay" onClick={() => setShowRoomModal(false)} />
          <View className="room-modal-panel">
            <View className="room-modal-header">
              <Text className="room-modal-title">选择房间和人数</Text>
              <View className="room-modal-close" onClick={() => setShowRoomModal(false)}>
                <Text>×</Text>
              </View>
            </View>

            <View className="room-controls">
              <View className="room-control">
                <Text className="room-control-label">房间数</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => handleRoomCountChange(-1)}><Text>-</Text></View>
                  <Text className="room-control-value">{roomCount}间</Text>
                  <View className="room-control-button" onClick={() => handleRoomCountChange(1)}><Text>+</Text></View>
                </View>
              </View>

              <View className="room-control">
                <Text className="room-control-label">成人</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => handleAdultCountChange(-1)}><Text>-</Text></View>
                  <Text className="room-control-value">{adultCount}人</Text>
                  <View className="room-control-button" onClick={() => handleAdultCountChange(1)}><Text>+</Text></View>
                </View>
              </View>

              <View className="room-control">
                <Text className="room-control-label">儿童</Text>
                <View className="room-control-buttons">
                  <View className="room-control-button" onClick={() => handleChildCountChange(-1)}><Text>-</Text></View>
                  <Text className="room-control-value">{childCount}人</Text>
                  <View className="room-control-button" onClick={() => handleChildCountChange(1)}><Text>+</Text></View>
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
      ) : null}

      <View className="bottom-bar">
        <View className="bottom-price">
          <Text className="bottom-price-label">¥{selectedRoomType?.price ?? hotel.price}</Text>
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
