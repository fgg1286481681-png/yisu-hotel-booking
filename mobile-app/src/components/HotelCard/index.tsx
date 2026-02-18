import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Hotel } from '../../../shared/api';
import './index.scss';

interface HotelCardProps {
  hotel: Hotel;
  onClick?: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(hotel);
    }
  };

  return (
    <View className="hotel-card" onClick={handleClick}>
      <Image className="hotel-image" src={hotel.image} mode="aspectFill" />
      
      <View className="hotel-content">
        <View className="hotel-header">
          <Text className="hotel-name">{hotel.name}</Text>
          <View className="hotel-rating">
            <Text className="rating-text">{hotel.rating}</Text>
            <Text className="rating-label">分</Text>
          </View>
        </View>
        
        <Text className="hotel-address">{hotel.address}</Text>
        
        <View className="hotel-facilities">
          {hotel.facilities.slice(0, 3).map((facility, index) => (
            <View key={index} className="facility-tag">
              <Text className="facility-text">{facility}</Text>
            </View>
          ))}
          {hotel.facilities.length > 3 && (
            <View className="facility-tag">
              <Text className="facility-text">+{hotel.facilities.length - 3}更多</Text>
            </View>
          )}
        </View>
        
        <View className="hotel-footer">
          <View className="price-section">
            <Text className="price-label">起价</Text>
            <Text className="price-amount">¥{hotel.price}</Text>
            <Text className="price-unit">/晚</Text>
          </View>
          <View className="book-button">
            <Text className="book-text">预订</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HotelCard;