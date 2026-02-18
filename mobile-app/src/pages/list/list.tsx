import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import HotelCard from '../../components/HotelCard';
import { Hotel } from '../../../shared/api';
import './list.css';

const ListPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟数据 - 将在Phase 2中替换为真实数据
  const mockHotels: Hotel[] = [
    {
      id: 1,
      name: '北京王府井大酒店',
      address: '北京市东城区王府井大街',
      price: 580,
      rating: 4.5,
      image: 'https://example.com/hotel1.jpg',
      city: '北京',
      facilities: ['免费WiFi', '停车场', '餐厅', '健身房']
    },
    {
      id: 2,
      name: '上海外滩华尔道夫酒店',
      address: '上海市黄浦区中山东一路',
      price: 1200,
      rating: 4.8,
      image: 'https://example.com/hotel2.jpg',
      city: '上海',
      facilities: ['免费WiFi', '游泳池', '水疗中心', '餐厅']
    }
  ];

  const handleHotelClick = (hotel: Hotel) => {
    console.log('点击酒店:', hotel);
    // 将在Phase 3中实现跳转到详情页
  };

  return (
    <View className="list-page">
      <View className="page-header">
        <Text className="page-title">酒店列表</Text>
        <Text className="page-subtitle">找到最适合您的住宿</Text>
      </View>

      <View className="filter-section">
        <Text className="filter-text">筛选条件将在Phase 2中实现</Text>
      </View>

      <View className="hotels-list">
        {mockHotels.map(hotel => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onClick={handleHotelClick}
          />
        ))}
      </View>

      <View className="loading-indicator">
        {loading && <Text className="loading-text">加载中...</Text>}
      </View>

      <View className="empty-state">
        {hotels.length === 0 && !loading && (
          <Text className="empty-text">暂无酒店数据</Text>
        )}
      </View>
    </View>
  );
};

export default ListPage;