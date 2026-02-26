"use strict";
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const taro = require("../../taro.js");
const common = require("../../common.js");
require("../../babelHelpers.js");
const search = "";
const hotSearchData = [
  { id: 1, name: "北京", desc: "北京热门商圈与景点" },
  { id: 2, name: "上海", desc: "外滩、陆家嘴热门酒店" },
  { id: 3, name: "广州", desc: "珠江新城与上下九步行街" },
  { id: 4, name: "三亚", desc: "海景度假与亲子酒店" },
  { id: 5, name: "成都", desc: "春熙路与青城山度假" },
  { id: 6, name: "易宿", desc: "易宿品牌全国门店" },
  { id: 7, name: "爱住", desc: "爱住品牌精选与度假" }
];
const SearchPage = () => {
  const [searchText, setSearchText] = taro.useState("");
  const [currentCity, setCurrentCity] = taro.useState("北京");
  const [showResults, setShowResults] = taro.useState(false);
  const [searchResults, setSearchResults] = taro.useState([]);
  const [loading, setLoading] = taro.useState(false);
  const searchInputRef = taro.useRef(null);
  taro.useEffect(() => {
    var _a;
    const currentPage = taro.Taro.getCurrentPages().pop();
    if ((_a = currentPage == null ? void 0 : currentPage.options) == null ? void 0 : _a.city) {
      try {
        const city = decodeURIComponent(currentPage.options.city);
        setCurrentCity(city);
      } catch (e) {
        setCurrentCity(currentPage.options.city);
      }
    } else {
      setCurrentCity("北京");
    }
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);
  }, []);
  const performSearch = (keyword) => __async(exports, null, function* () {
    const trimmed = keyword.trim();
    if (!trimmed) {
      taro.Taro.showToast({
        title: "请输入搜索内容",
        icon: "none",
        duration: 2e3
      });
      return;
    }
    setLoading(true);
    try {
      const hotels = yield common.getHotels({ city: currentCity });
      const lower = trimmed.toLowerCase();
      const results = hotels.filter((hotel) => {
        const name = (hotel.name || "").toLowerCase();
        const address = (hotel.address || "").toLowerCase();
        const city = (hotel.city || "").toLowerCase();
        const brand = hotel.brand ? String(hotel.brand).toLowerCase() : "";
        return name.includes(lower) || address.includes(lower) || city.includes(lower) || brand.includes(lower);
      });
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("搜索酒店失败:", error);
      taro.Taro.showToast({
        title: "搜索失败，请稍后重试",
        icon: "none",
        duration: 2e3
      });
    } finally {
      setLoading(false);
    }
  });
  const handleSearch = () => {
    if (!searchText.trim()) {
      taro.Taro.showToast({
        title: "请输入搜索内容",
        icon: "none",
        duration: 2e3
      });
      return;
    }
    performSearch(searchText);
  };
  const handleCancel = () => {
    taro.Taro.navigateBack();
  };
  const handleHotSearchClick = (item) => {
    setSearchText(item.name);
    performSearch(item.name);
  };
  const handleRecommendClick = (hotel) => {
    taro.Taro.showToast({
      title: `选择酒店: ${hotel.name}`,
      icon: "success",
      duration: 2e3
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "search-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "search-header", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "search-container", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "search-input-wrapper", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "search-icon", children: "🔍" }),
        /* @__PURE__ */ taro.jsx(
          taro.Input,
          {
            ref: searchInputRef,
            className: "search-input",
            placeholder: "位置/品牌/酒店",
            placeholderStyle: "color: #999;",
            value: searchText,
            onInput: (e) => setSearchText(e.detail.value),
            onConfirm: handleSearch,
            focus: true,
            confirmType: "search"
          }
        )
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "cancel-button", onClick: handleCancel, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "取消" }) })
    ] }) }),
    showResults ? (
      // 搜索结果
      /* @__PURE__ */ taro.jsx(taro.View, { children: loading ? /* @__PURE__ */ taro.jsxs(taro.View, { className: "empty-state", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-icon", children: "⏳" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-title", children: "正在搜索中..." }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-desc", children: "请稍候" })
      ] }) : searchResults.length > 0 ? /* @__PURE__ */ taro.jsxs(taro.View, { className: "recommend-section", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "recommend-title", children: [
          "搜索结果 (",
          searchResults.length,
          ")"
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "recommend-list", children: searchResults.map(
          (hotel) => /* @__PURE__ */ taro.jsxs(
            taro.View,
            {
              className: "recommend-item",
              onClick: () => handleRecommendClick(hotel),
              children: [
                /* @__PURE__ */ taro.jsx(taro.View, { className: "recommend-image", children: /* @__PURE__ */ taro.jsx(
                  taro.Image,
                  {
                    src: hotel.image,
                    mode: "aspectFill",
                    className: "recommend-image-img"
                  }
                ) }),
                /* @__PURE__ */ taro.jsxs(taro.View, { className: "recommend-info", children: [
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "recommend-name", children: hotel.name }),
                  /* @__PURE__ */ taro.jsxs(taro.Text, { className: "recommend-location", children: [
                    hotel.city,
                    " · ",
                    hotel.address
                  ] }),
                  /* @__PURE__ */ taro.jsxs(taro.Text, { className: "recommend-price", children: [
                    "¥",
                    hotel.price,
                    "起"
                  ] })
                ] })
              ]
            },
            hotel.id
          )
        ) })
      ] }) : /* @__PURE__ */ taro.jsxs(taro.View, { className: "empty-state", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-icon", children: "🔍" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-title", children: "未找到相关结果" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-desc", children: "请尝试其他关键词搜索" })
      ] }) })
    ) : (
      // 热搜和推荐
      /* @__PURE__ */ taro.jsxs(taro.View, { children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "hot-search-section", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "hot-search-title", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { children: currentCity }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "hot-search-city", children: "热搜" })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "hot-search-list", children: hotSearchData.map(
            (item, index) => /* @__PURE__ */ taro.jsxs(
              taro.View,
              {
                className: "hot-search-item",
                onClick: () => handleHotSearchClick(item),
                children: [
                  /* @__PURE__ */ taro.jsx(taro.View, { className: `hot-search-rank ${index < 3 ? "top" : ""}`, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: index + 1 }) }),
                  /* @__PURE__ */ taro.jsxs(taro.View, { className: "hot-search-content", children: [
                    /* @__PURE__ */ taro.jsx(taro.Text, { className: "hot-search-name", children: item.name }),
                    /* @__PURE__ */ taro.jsx(taro.Text, { className: "hot-search-desc", children: item.desc })
                  ] }),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "hot-search-arrow", children: "›" })
                ]
              },
              item.id
            )
          ) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "recommend-section", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "recommend-title", children: [
            currentCity,
            "推荐酒店"
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "recommend-list", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "empty-state", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-icon", children: "✨" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-title", children: "试试上面的热搜或自行输入" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-desc", children: "搜索“易宿 / 爱住 / 城市名 / 酒店名”即可查看 PC Mock 中的门店" })
          ] }) })
        ] })
      ] })
    )
  ] });
};
var config = {
  "navigationBarTitleText": "搜索酒店",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#f5f5f5",
  "enablePullDownRefresh": false,
  "disableScroll": true
};
Page(taro.createPageConfig(SearchPage, "pages/search/search", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=search.js.map
