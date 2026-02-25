import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Input, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './search.css';

// 热搜数据
const hotSearchData = [
  { id: 1, name: '北京王府井酒店', desc: '靠近王府井步行街，交通便利' },
  { id: 2, name: '上海外滩酒店', desc: '外滩景观，豪华体验' },
  { id: 3, name: '广州珠江新城酒店', desc: 'CBD核心区，商务出行首选' },
  { id: 4, name: '深圳南山酒店', desc: '科技园区附近，适合商务人士' },
  { id: 5, name: '成都春熙路酒店', desc: '购物天堂，美食众多' },
  { id: 6, name: '杭州西湖酒店', desc: '湖景房，风景优美' },
  { id: 7, name: '西安钟楼酒店', desc: '古城中心，旅游便利' },
  { id: 8, name: '重庆解放碑酒店', desc: '商圈核心，夜景迷人' },
];

// 推荐酒店数据
const recommendHotels = [
  { id: 1, name: '北京国际饭店', location: '北京市东城区', price: '¥680起', image: '🏨' },
  { id: 2, name: '上海和平饭店', location: '上海市黄浦区', price: '¥980起', image: '🏨' },
  { id: 3, name: '广州白天鹅宾馆', location: '广州市荔湾区', price: '¥780起', image: '🏨' },
  { id: 4, name: '深圳香格里拉酒店', location: '深圳市福田区', price: '¥880起', image: '🏨' },
  { id: 5, name: '成都锦江宾馆', location: '成都市锦江区', price: '¥580起', image: '🏨' },
  { id: 6, name: '杭州西子宾馆', location: '杭州市西湖区', price: '¥680起', image: '🏨' },
];

const SearchPage: React.FC = () => {
  // 状态管理
  const [searchText, setSearchText] = useState('');
  const [currentCity, setCurrentCity] = useState('北京');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // 搜索输入框引用
  const searchInputRef = useRef<any>(null);

  // 初始化 - 获取当前城市
  useEffect(() => {
    // 从路由参数获取城市
    const currentPage = Taro.getCurrentPages().pop();
    if (currentPage?.options?.city) {
      try {
        const city = decodeURIComponent(currentPage.options.city);
        setCurrentCity(city);
      } catch {
        setCurrentCity(currentPage.options.city);
      }
    } else {
      // 默认使用北京
      setCurrentCity('北京');
    }

    // 自动聚焦搜索框
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);
  }, []);

  // 处理搜索
  const handleSearch = () => {
    if (!searchText.trim()) {
      Taro.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 模拟搜索
    const results = recommendHotels.filter(hotel =>
      hotel.name.includes(searchText) || hotel.location.includes(searchText)
    );
    
    setSearchResults(results);
    setShowResults(true);
  };

  // 处理取消
  const handleCancel = () => {
    Taro.navigateBack();
  };

  // 处理热搜点击
  const handleHotSearchClick = (item: any) => {
    setSearchText(item.name);
    // 自动搜索
    const results = recommendHotels.filter(hotel =>
      hotel.name.includes(item.name) || hotel.location.includes(item.name)
    );
    setSearchResults(results);
    setShowResults(true);
  };

  // 处理推荐酒店点击
  const handleRecommendClick = (hotel: any) => {
    Taro.showToast({
      title: `选择酒店: ${hotel.name}`,
      icon: 'success',
      duration: 2000
    });
    // 实际项目中这里会跳转到酒店详情页
  };

  return (
    <View className="search-page">
      {/* 搜索框 */}
      <View className="search-header">
        <View className="search-container">
          <View className="search-input-wrapper">
            <Text className="search-icon">🔍</Text>
            <Input
              ref={searchInputRef}
              className="search-input"
              placeholder="位置/品牌/酒店"
              placeholderStyle="color: #999;"
              value={searchText}
              onInput={(e) => setSearchText(e.detail.value)}
              onConfirm={handleSearch}
              focus={true}
              confirmType="search"
            />
          </View>
          <View className="cancel-button" onClick={handleCancel}>
            <Text>取消</Text>
          </View>
        </View>
      </View>

      {/* 搜索结果或热搜 */}
      {showResults ? (
        // 搜索结果
        <View>
          {searchResults.length > 0 ? (
            <View className="recommend-section">
              <Text className="recommend-title">搜索结果 ({searchResults.length})</Text>
              <View className="recommend-list">
                {searchResults.map(hotel => (
                  <View
                    key={hotel.id}
                    className="recommend-item"
                    onClick={() => handleRecommendClick(hotel)}
                  >
                    <View className="recommend-image">
                      <Text>{hotel.image}</Text>
                    </View>
                    <View className="recommend-info">
                      <Text className="recommend-name">{hotel.name}</Text>
                      <Text className="recommend-location">{hotel.location}</Text>
                      <Text className="recommend-price">{hotel.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="empty-state">
              <Text className="empty-icon">🔍</Text>
              <Text className="empty-title">未找到相关结果</Text>
              <Text className="empty-desc">请尝试其他关键词搜索</Text>
            </View>
          )}
        </View>
      ) : (
        // 热搜和推荐
        <View>
          {/* 热搜部分 */}
          <View className="hot-search-section">
            <Text className="hot-search-title">
              <Text>{currentCity}</Text>
              <Text className="hot-search-city">热搜</Text>
            </Text>
            <View className="hot-search-list">
              {hotSearchData.map((item, index) => (
                <View
                  key={item.id}
                  className="hot-search-item"
                  onClick={() => handleHotSearchClick(item)}
                >
                  <View className={`hot-search-rank ${index < 3 ? 'top' : ''}`}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View className="hot-search-content">
                    <Text className="hot-search-name">{item.name}</Text>
                    <Text className="hot-search-desc">{item.desc}</Text>
                  </View>
                  <Text className="hot-search-arrow">›</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 推荐酒店部分 */}
          <View className="recommend-section">
            <Text className="recommend-title">{currentCity}推荐酒店</Text>
            <View className="recommend-list">
              {recommendHotels.map(hotel => (
                <View
                  key={hotel.id}
                  className="recommend-item"
                  onClick={() => handleRecommendClick(hotel)}
                >
                  <View className="recommend-image">
                    <Text>{hotel.image}</Text>
                  </View>
                  <View className="recommend-info">
                    <Text className="recommend-name">{hotel.name}</Text>
                    <Text className="recommend-location">{hotel.location}</Text>
                    <Text className="recommend-price">{hotel.price}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchPage;
