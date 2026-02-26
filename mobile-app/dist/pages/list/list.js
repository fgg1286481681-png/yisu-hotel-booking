"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
const index = "";
const HotelCard = ({ hotel, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(hotel);
    }
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-card", onClick: handleClick, children: [
    /* @__PURE__ */ taro.jsx(taro.Image, { className: "hotel-image", src: hotel.image, mode: "aspectFill" }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-content", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "hotel-name", children: hotel.name }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-rating", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-text", children: hotel.rating }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-label", children: "分" })
        ] })
      ] }),
      hotel.starRating && /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-stars", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "stars-text", children: [
          "★".repeat(Math.floor(hotel.starRating)),
          "☆".repeat(5 - Math.floor(hotel.starRating))
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "stars-label", children: [
          hotel.starRating,
          "星"
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "hotel-address", children: hotel.address }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-facilities", children: [
        hotel.facilities.slice(0, 3).map(
          (facility, index2) => /* @__PURE__ */ taro.jsx(taro.View, { className: "facility-tag", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "facility-text", children: facility }) }, index2)
        ),
        hotel.facilities.length > 3 && /* @__PURE__ */ taro.jsx(taro.View, { className: "facility-tag", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "facility-text", children: [
          "+",
          hotel.facilities.length - 3,
          "更多"
        ] }) })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-footer", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-section", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-label", children: "起价" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price-amount", children: [
            "¥",
            hotel.price
          ] }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-unit", children: "/晚" })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "book-button", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "book-text", children: "预订" }) })
      ] })
    ] })
  ] });
};
const list = "";
const sortOptions = [
  { label: "推荐排序", value: "recommend" },
  { label: "价格从低到高", value: "price_asc" },
  { label: "价格从高到低", value: "price_desc" },
  { label: "评分从高到低", value: "rating_desc" },
  { label: "距离从近到远", value: "distance_asc" }
];
const sortHotelsLocally = (list2, sortBy) => {
  const hotelsCopy = [...list2];
  switch (sortBy) {
    case "price_asc":
      hotelsCopy.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      hotelsCopy.sort((a, b) => b.price - a.price);
      break;
    case "rating_desc":
      hotelsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "star_high":
      hotelsCopy.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
      break;
    case "distance_asc":
      hotelsCopy.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      break;
    case "recommend":
    default:
      hotelsCopy.sort((a, b) => {
        const updatedA = a.updatedAt ? Number(a.updatedAt) : 0;
        const updatedB = b.updatedAt ? Number(b.updatedAt) : 0;
        if (updatedB !== updatedA) {
          return updatedB - updatedA;
        }
        const scoreA = (a.rating || 0) * 20 - a.price / 50;
        const scoreB = (b.rating || 0) * 20 - b.price / 50;
        return scoreB - scoreA;
      });
      break;
  }
  return hotelsCopy;
};
const starOptions = [
  { label: "不限", value: 0 },
  { label: "经济型", value: 1 },
  { label: "舒适型", value: 2 },
  { label: "高档型", value: 3 },
  { label: "豪华型", value: 4 },
  { label: "五星级", value: 5 }
];
const ListPage = () => {
  var _a, _b;
  const [hotels, setHotels] = taro.useState([]);
  const [loading, setLoading] = taro.useState(false);
  const [hasMore, setHasMore] = taro.useState(true);
  const [page, setPage] = taro.useState(1);
  const [total, setTotal] = taro.useState(0);
  const DEFAULT_PRICE_RANGE = [0, 1e3];
  const [filters, setFilters] = taro.useState({
    priceRange: DEFAULT_PRICE_RANGE,
    starRating: [],
    // 默认为不限星级（空数组）
    sortBy: "recommend"
  });
  const PRICE_MAX = 600;
  const priceQuickOptions = [
    { label: "¥0-200", value: [0, 200] },
    { label: "¥200-300", value: [200, 300] },
    { label: "¥300-500", value: [300, 500] },
    { label: "¥500以上", value: [500, PRICE_MAX] }
  ];
  const [showPriceModal, setShowPriceModal] = taro.useState(false);
  const [draftPriceRange, setDraftPriceRange] = taro.useState(filters.priceRange);
  const [draftStarRating, setDraftStarRating] = taro.useState(filters.starRating);
  const [selectedPriceOption, setSelectedPriceOption] = taro.useState(null);
  const [showNavModal, setShowNavModal] = taro.useState(false);
  const [location, setLocation] = taro.useState({
    city: "北京",
    address: "北京市朝阳区"
  });
  const [checkInDate, setCheckInDate] = taro.useState("2024-01-15");
  const [checkOutDate, setCheckOutDate] = taro.useState("2024-01-16");
  const [nights, setNights] = taro.useState(1);
  const [roomCount, setRoomCount] = taro.useState(1);
  const [adultCount, setAdultCount] = taro.useState(2);
  const [childCount, setChildCount] = taro.useState(0);
  const [showCityModal, setShowCityModal] = taro.useState(false);
  taro.useState(false);
  const [showRoomModal, setShowRoomModal] = taro.useState(false);
  const [showSortModal, setShowSortModal] = taro.useState(false);
  const [showDistanceModal, setShowDistanceModal] = taro.useState(false);
  const [showFilterModal, setShowFilterModal] = taro.useState(false);
  const [showCalendar, setShowCalendar] = taro.useState(false);
  const sortModalOptions = [
    { id: "smart", label: "智能排序", value: "recommend" },
    { id: "price_low", label: "低价优先", value: "price_asc" },
    { id: "price_high", label: "高价优先", value: "price_desc" },
    { id: "rating", label: "好评优先", value: "rating_desc" },
    { id: "star_high", label: "高星优先", value: "star_high" },
    { id: "distance", label: "直线距离", value: "distance_asc" }
  ];
  const [selectedSort, setSelectedSort] = taro.useState("recommend");
  const [searchParams, setSearchParams] = taro.useState({});
  taro.useMemo(() => {
    const maxText = filters.priceRange[1] >= PRICE_MAX ? "400+" : String(filters.priceRange[1]);
    return `¥${filters.priceRange[0]} - ¥${maxText}`;
  }, [filters.priceRange]);
  taro.useEffect(() => {
    const currentPage = taro.Taro.getCurrentPages().pop();
    if (currentPage == null ? void 0 : currentPage.options) {
      const params = currentPage.options;
      const newSearchParams = {};
      let initialPriceRange = DEFAULT_PRICE_RANGE;
      if (params.city) {
        try {
          const city = decodeURIComponent(params.city);
          newSearchParams.city = city;
          setLocation((prev) => __spreadProps(__spreadValues({}, prev), { city }));
        } catch (e) {
          newSearchParams.city = params.city;
          setLocation((prev) => __spreadProps(__spreadValues({}, prev), { city: params.city }));
        }
      }
      if (params.checkIn) {
        newSearchParams.checkIn = params.checkIn;
        setCheckInDate(params.checkIn);
      }
      if (params.checkOut) {
        newSearchParams.checkOut = params.checkOut;
        setCheckOutDate(params.checkOut);
      }
      if (params.minPrice) {
        const min = Number(params.minPrice);
        const max = params.maxPrice ? Number(params.maxPrice) : min >= 500 ? PRICE_MAX : DEFAULT_PRICE_RANGE[1];
        initialPriceRange = [min, max];
      } else if (params.maxPrice) {
        initialPriceRange = [0, Number(params.maxPrice)];
      }
      if (params.sort)
        newSearchParams.sort = params.sort;
      let initialStarRating = [];
      if (params.starRating) {
        if (Array.isArray(params.starRating)) {
          initialStarRating = params.starRating.map((r) => Number(r));
        } else if (typeof params.starRating === "string") {
          if (params.starRating.includes(",")) {
            initialStarRating = params.starRating.split(",").map((r) => Number(r.trim()));
          } else {
            initialStarRating = [Number(params.starRating)];
          }
        }
      }
      if (params.checkIn && params.checkOut) {
        const inDate = new Date(params.checkIn);
        const outDate = new Date(params.checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        setNights(diffDays);
      }
      setSearchParams(newSearchParams);
      setFilters((prev) => __spreadProps(__spreadValues({}, prev), { priceRange: initialPriceRange, starRating: initialStarRating }));
      setDraftPriceRange(initialPriceRange);
      setDraftStarRating(initialStarRating);
      if (newSearchParams.city) {
        taro.Taro.setNavigationBarTitle({
          title: `${newSearchParams.city}酒店列表`
        });
      }
      const initialFilters = {
        priceRange: initialPriceRange,
        starRating: initialStarRating,
        sortBy: "recommend"
      };
      loadHotels(true, newSearchParams, initialFilters);
      return;
    }
    loadHotels(true);
  }, []);
  const loadHotels = (isRefresh = false, searchOverride, filtersOverride) => __async(exports, null, function* () {
    if (loading)
      return;
    setLoading(true);
    const currentPage = isRefresh ? 1 : page;
    yield new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const effectiveSearch = searchOverride || searchParams;
      const effectiveFilters = filtersOverride || filters;
      const queryParams = __spreadProps(__spreadValues({}, effectiveSearch), {
        page: currentPage,
        limit: 5
      });
      if (effectiveFilters.priceRange[0] !== 0 || effectiveFilters.priceRange[1] !== 1e3) {
        queryParams.minPrice = effectiveFilters.priceRange[0];
        if (effectiveFilters.priceRange[1] < PRICE_MAX) {
          queryParams.maxPrice = effectiveFilters.priceRange[1];
        }
      }
      if (effectiveFilters.starRating.length > 0) {
        queryParams.starRating = effectiveFilters.starRating;
      }
      if (effectiveFilters.sortBy !== "recommend") {
        queryParams.sort = effectiveFilters.sortBy;
      }
      const data = yield common.getHotels(queryParams);
      const filteredData = data.filter((hotel) => {
        const [minPrice, maxPrice] = effectiveFilters.priceRange;
        if (hotel.price < minPrice) {
          return false;
        }
        if (maxPrice < PRICE_MAX && hotel.price > maxPrice) {
          return false;
        }
        if (effectiveFilters.starRating.length > 0 && !effectiveFilters.starRating.includes(hotel.starRating || 0)) {
          return false;
        }
        return true;
      });
      const sortedData = sortHotelsLocally(filteredData, effectiveFilters.sortBy);
      const displayData = sortedData.slice(0, 5);
      if (isRefresh) {
        setHotels(displayData);
        setPage(1);
        if (displayData.length === 0) {
          taro.Taro.showToast({
            title: "未搜索到合适的目标",
            icon: "none",
            duration: 2e3
          });
        }
        setHasMore(sortedData.length > displayData.length);
        setTotal(sortedData.length);
      } else {
        setHotels((prev) => {
          const existingIds = new Set(prev.map((h) => h.id));
          const newItems = displayData.filter((h) => !existingIds.has(h.id));
          const merged = [...prev, ...newItems];
          if (newItems.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(displayData.length === newItems.length && displayData.length === 5);
          }
          setTotal((prevTotal) => Math.max(prevTotal, merged.length, sortedData.length));
          return merged;
        });
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error("加载酒店数据失败:", error);
      taro.Taro.showToast({
        title: "加载失败",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const resetFilters = () => {
    setFilters({
      priceRange: DEFAULT_PRICE_RANGE,
      starRating: [],
      // 重置为不限星级（空数组）
      sortBy: "recommend"
    });
    setSelectedSort("recommend");
    setDraftPriceRange(DEFAULT_PRICE_RANGE);
    setDraftStarRating([]);
    loadHotels(true);
  };
  const handleScrollToLower = () => {
    if (!loading && hasMore) {
      loadHotels(false);
    }
  };
  const handleRefresh = () => {
    loadHotels(true);
  };
  const handleHotelClick = (hotel) => {
    const params = {
      id: hotel.id.toString(),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      roomCount: roomCount.toString(),
      adultCount: adultCount.toString(),
      childCount: childCount.toString()
    };
    taro.Taro.navigateTo({
      url: `/pages/detail/detail?${new taro.URLSearchParams(params).toString()}`
    });
  };
  const handleSearchClick = () => {
    taro.Taro.navigateTo({
      url: `/pages/search/search?city=${encodeURIComponent(location.city)}`
    });
  };
  const handleDraftMinChange = (e) => {
    const v = Number(e.detail.value);
    setDraftPriceRange((prev) => [v, prev[1] < v ? v : prev[1]]);
  };
  const handleDraftMaxChange = (e) => {
    const v = Number(e.detail.value);
    setDraftPriceRange((prev) => [prev[0] > v ? v : prev[0], v]);
  };
  const applyDraftPrice = () => {
    const newFilters = {
      priceRange: draftPriceRange,
      starRating: draftStarRating,
      sortBy: filters.sortBy
    };
    setFilters((prev) => __spreadValues(__spreadValues({}, prev), newFilters));
    setShowPriceModal(false);
    loadHotels(true, void 0, newFilters);
  };
  const getCurrentLocation = () => {
    taro.Taro.getLocation({
      type: "wgs84",
      success: (_res) => {
        setLocation({
          city: "北京",
          address: "北京市朝阳区"
        });
      },
      fail: (err) => {
        console.error("获取位置失败:", err);
        taro.Taro.showToast({
          title: "定位失败，请手动选择城市",
          icon: "none"
        });
      }
    });
  };
  const handleDateSelect = (value) => {
    if (Array.isArray(value)) {
      const [startDate, endDate] = value;
      setCheckInDate(startDate);
      setCheckOutDate(endDate);
      const inDate = new Date(startDate);
      const outDate = new Date(endDate);
      const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      setNights(diffDays);
    }
    setShowCalendar(false);
  };
  const applyNavChanges = () => {
    setShowNavModal(false);
    const newSearchParams = __spreadProps(__spreadValues({}, searchParams), {
      city: location.city,
      // 按当前选择的城市搜索
      checkIn: checkInDate,
      // 使用当前入住日期
      checkOut: checkOutDate
      // 使用当前离店日期
    });
    setSearchParams(newSearchParams);
    if (location.city) {
      taro.Taro.setNavigationBarTitle({
        title: `${location.city}酒店列表`
      });
    }
    loadHotels(true, newSearchParams);
  };
  taro.useMemo(() => {
    var _a2;
    if (filters.starRating.length === 0) {
      return "不限";
    }
    if (filters.starRating.length === 1) {
      const star = filters.starRating[0];
      return ((_a2 = starOptions.find((opt) => opt.value === star)) == null ? void 0 : _a2.label) || "不限";
    }
    return "多选";
  }, [filters.starRating]);
  ((_a = sortOptions.find((opt) => opt.value === filters.sortBy)) == null ? void 0 : _a.label) || "推荐排序";
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "list-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-bar", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-section nav-info", onClick: () => setShowNavModal(true), children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-grid", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-cell", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-cell-label", children: "我的" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-cell-label", children: "位置" })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-cell", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-cell-value", children: checkInDate.split("-").slice(1).join("/") }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-cell-value", children: checkOutDate.split("-").slice(1).join("/") })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-cell", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "nav-cell-value", children: [
            roomCount,
            "间"
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "nav-cell-value", children: [
            adultCount + childCount,
            "人"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-section nav-search", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "search-box", onClick: handleSearchClick, children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "search-icon", children: "🔍" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "search-placeholder", children: "位置/品牌/酒店" })
      ] }) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-section nav-map", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "map-icon", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "🗺️" }) }) })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-panel", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "filter-row", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-item", onClick: () => setShowSortModal(true), children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "filter-label", children: [
        ((_b = sortModalOptions.find((opt) => opt.value === selectedSort)) == null ? void 0 : _b.label) || "智能排序",
        "▼"
      ] }) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-item", onClick: () => setShowDistanceModal(true), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "filter-label", children: "位置距离▼" }) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-item", onClick: () => {
        setDraftPriceRange(filters.priceRange);
        setDraftStarRating(filters.starRating);
        const quickIndex = priceQuickOptions.findIndex(
          (opt) => opt.value[0] === filters.priceRange[0] && (opt.value[1] === filters.priceRange[1] || filters.priceRange[1] >= 600 && opt.value[1] === 600)
        );
        setSelectedPriceOption(quickIndex >= 0 ? quickIndex : null);
        setShowPriceModal(true);
      }, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "filter-label", children: "价格/星级▼" }) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-item", onClick: () => setShowFilterModal(true), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "filter-label", children: "筛选▼" }) })
    ] }) }),
    showPriceModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "price-star-modal-overlay", onClick: () => setShowPriceModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-star-modal-title", children: "价格 / 星级" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "price-star-modal-close", onClick: () => setShowPriceModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-body", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-price-block", children: [
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "modal-price-label", children: [
              "价格区间：¥",
              draftPriceRange[0],
              " - ¥",
              draftPriceRange[1] >= PRICE_MAX ? "500+" : draftPriceRange[1]
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-sliders", children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-slider-row", children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "modal-slider-min", children: [
                  "¥",
                  draftPriceRange[0]
                ] }),
                /* @__PURE__ */ taro.jsx(
                  taro.Slider,
                  {
                    className: "modal-slider",
                    min: 0,
                    max: 500,
                    value: draftPriceRange[0],
                    onChanging: handleDraftMinChange,
                    onChange: handleDraftMinChange,
                    blockSize: 24,
                    backgroundColor: "#f0f0f0",
                    activeColor: "#1890ff"
                  }
                )
              ] }),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-slider-row", children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "modal-slider-min", children: [
                  "¥",
                  draftPriceRange[1] >= PRICE_MAX ? "500+" : draftPriceRange[1]
                ] }),
                /* @__PURE__ */ taro.jsx(
                  taro.Slider,
                  {
                    className: "modal-slider",
                    min: 1,
                    max: 500,
                    value: draftPriceRange[1],
                    onChanging: handleDraftMaxChange,
                    onChange: handleDraftMaxChange,
                    blockSize: 24,
                    backgroundColor: "#f0f0f0",
                    activeColor: "#1890ff"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-quick-price", children: priceQuickOptions.map(
              (opt, i) => /* @__PURE__ */ taro.jsx(
                taro.View,
                {
                  className: `modal-quick-btn ${selectedPriceOption === i ? "selected" : ""}`,
                  onClick: () => {
                    setDraftPriceRange([opt.value[0], opt.value[1]]);
                    setSelectedPriceOption(i);
                  },
                  children: /* @__PURE__ */ taro.jsx(taro.Text, { children: opt.label })
                },
                i
              )
            ) })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-star-block", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "modal-star-label", children: "星级" }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-star-buttons", children: [2, 3, 4, 5].map(
              (star) => /* @__PURE__ */ taro.jsx(
                taro.View,
                {
                  className: `modal-star-btn ${draftStarRating.includes(star) ? "active" : ""}`,
                  onClick: () => {
                    setDraftStarRating((prev) => {
                      if (prev.includes(star)) {
                        return prev.filter((s) => s !== star);
                      } else {
                        return [...prev, star];
                      }
                    });
                  },
                  children: /* @__PURE__ */ taro.jsxs(taro.Text, { children: [
                    "⭐ ",
                    star,
                    "星"
                  ] })
                },
                star
              )
            ) })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-button-group", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-button clear-button", onClick: () => {
              setDraftPriceRange(DEFAULT_PRICE_RANGE);
              setDraftStarRating([]);
              setSelectedPriceOption(null);
            }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "清除" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-button confirm-button", onClick: applyDraftPrice, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "确定" }) })
          ] })
        ] })
      ] })
    ] }),
    showSortModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "sort-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "sort-modal-overlay", onClick: () => setShowSortModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "sort-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "sort-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "sort-modal-title", children: "排序方式" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "sort-modal-close", onClick: () => setShowSortModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "sort-modal-body", children: sortModalOptions.map(
          (option) => /* @__PURE__ */ taro.jsxs(
            taro.View,
            {
              className: "sort-modal-row",
              onClick: () => {
                setSelectedSort(option.value);
                setFilters((prev) => {
                  const newFilters = __spreadProps(__spreadValues({}, prev), { sortBy: option.value });
                  setTimeout(() => {
                    loadHotels(true, void 0, newFilters);
                  }, 0);
                  return newFilters;
                });
                setShowSortModal(false);
              },
              children: [
                /* @__PURE__ */ taro.jsx(
                  taro.Text,
                  {
                    className: "sort-modal-row-label",
                    style: {
                      fontSize: "24rpx",
                      color: selectedSort === option.value ? "#1890ff" : "#666"
                    },
                    children: option.label
                  }
                ),
                /* @__PURE__ */ taro.jsx(taro.View, { className: "sort-modal-row-right", children: selectedSort === option.value && /* @__PURE__ */ taro.jsx(taro.Text, { className: "sort-modal-check", children: "✓" }) })
              ]
            },
            option.id
          )
        ) })
      ] })
    ] }),
    showDistanceModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "distance-modal-overlay", onClick: () => setShowDistanceModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "distance-modal-title", children: "位置距离" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "distance-modal-close", onClick: () => setShowDistanceModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance-modal-body", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { style: { fontSize: "28rpx", color: "#666", textAlign: "center", padding: "80rpx 0" }, children: "位置距离筛选功能开发中..." }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "distance-modal-actions", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "distance-modal-button", onClick: () => setShowDistanceModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "distance-modal-button-text", children: "确定" }) }) })
        ] })
      ] })
    ] }),
    showFilterModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "filter-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-modal-overlay", onClick: () => setShowFilterModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "filter-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "filter-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "filter-modal-title", children: "更多筛选" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-modal-close", onClick: () => setShowFilterModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "filter-modal-body", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { style: { fontSize: "28rpx", color: "#666", textAlign: "center", padding: "80rpx 0" }, children: "更多筛选功能开发中..." }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-modal-actions", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "filter-modal-button", onClick: () => setShowFilterModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "filter-modal-button-text", children: "确定" }) }) })
        ] })
      ] })
    ] }),
    showNavModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-overlay", onClick: () => setShowNavModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-title", children: "修改搜索条件" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-close", onClick: () => setShowNavModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-body", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-row", onClick: () => setShowCityModal(true), children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-row-left", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-row-label", children: "位置" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-row-value", children: location.city })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-row-right", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-icon", onClick: (e) => {
              e.stopPropagation();
              getCurrentLocation();
            }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "📍" }) }) })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-row", onClick: () => setShowCalendar(true), children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-row-left", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-row-label", children: "日期" }),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-dates", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-date", children: checkInDate }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-date-separator", children: "-" }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-date", children: checkOutDate })
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-row-right", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "nav-modal-nights", children: [
              nights,
              "晚"
            ] }) })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-row", onClick: () => setShowRoomModal(true), children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "nav-modal-row-left", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-row-label", children: "房间/人数" }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "nav-modal-row-value", children: [
                roomCount,
                "间，",
                adultCount + childCount,
                "人"
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-row-right", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "›" }) })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-actions", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "nav-modal-button", onClick: applyNavChanges, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "nav-modal-button-text", children: "确定" }) }) })
        ] })
      ] })
    ] }),
    showCityModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "city-modal-overlay", onClick: () => setShowCityModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-modal-title", children: "选择城市" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "city-modal-close", onClick: () => setShowCityModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-body", children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "city-search", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "搜索城市..." }) }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-list", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: "city-item", onClick: () => {
              setLocation(__spreadProps(__spreadValues({}, location), { city: "北京" }));
              setShowCityModal(false);
            }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "北京" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "city-item", onClick: () => {
              setLocation(__spreadProps(__spreadValues({}, location), { city: "上海" }));
              setShowCityModal(false);
            }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "上海" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "city-item", onClick: () => {
              setLocation(__spreadProps(__spreadValues({}, location), { city: "广州" }));
              setShowCityModal(false);
            }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "广州" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "city-item", onClick: () => {
              setLocation(__spreadProps(__spreadValues({}, location), { city: "深圳" }));
              setShowCityModal(false);
            }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "深圳" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "city-item", onClick: () => {
              setLocation(__spreadProps(__spreadValues({}, location), { city: "杭州" }));
              setShowCityModal(false);
            }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "杭州" }) })
          ] })
        ] })
      ] })
    ] }),
    showRoomModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-overlay", onClick: () => setShowRoomModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-modal-title", children: "房间和人数" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-close", onClick: () => setShowRoomModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-body", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-row", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "房间" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setRoomCount(Math.max(1, roomCount - 1)), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                roomCount,
                "间"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setRoomCount(roomCount + 1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-row", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "成人" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setAdultCount(Math.max(1, adultCount - 1)), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                adultCount,
                "人"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setAdultCount(adultCount + 1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-row", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "儿童" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setChildCount(Math.max(0, childCount - 1)), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                childCount,
                "人"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setChildCount(childCount + 1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-actions", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-button", onClick: () => setShowRoomModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-modal-button-text", children: "确定" }) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "results-info", children: searchParams.city && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "search-city", children: [
      "搜索城市: ",
      searchParams.city
    ] }) }),
    /* @__PURE__ */ taro.jsxs(
      taro.ScrollView,
      {
        className: "hotels-scroll",
        scrollY: true,
        onScrollToLower: handleScrollToLower,
        onRefresherRefresh: handleRefresh,
        refresherEnabled: true,
        refresherTriggered: loading,
        children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "hotels-list", children: hotels.map(
            (hotel) => /* @__PURE__ */ taro.jsx(
              HotelCard,
              {
                hotel,
                onClick: handleHotelClick
              },
              hotel.id
            )
          ) }),
          loading && /* @__PURE__ */ taro.jsx(taro.View, { className: "loading-more", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "loading-text", children: "加载中..." }) }),
          !hasMore && hotels.length > 0 && /* @__PURE__ */ taro.jsx(taro.View, { className: "no-more", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "no-more-text", children: "没有更多酒店了" }) }),
          !loading && hotels.length === 0 && /* @__PURE__ */ taro.jsxs(taro.View, { className: "empty-state", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-icon", children: "🏨" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-title", children: "未搜索到合适的目标" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-desc", children: "尝试调整价格区间、星级或其他筛选条件" }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "empty-action", onClick: resetFilters, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-action-text", children: "重置筛选条件" }) })
          ] })
        ]
      }
    ),
    hotels.length > 5 && /* @__PURE__ */ taro.jsx(
      taro.View,
      {
        className: "back-to-top",
        onClick: () => {
          taro.Taro.pageScrollTo({
            scrollTop: 0,
            duration: 300
          });
        },
        children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "back-to-top-text", children: "↑" })
      }
    ),
    /* @__PURE__ */ taro.jsx(
      common.Calendar,
      {
        mode: "range",
        value: [checkInDate, checkOutDate],
        onChange: handleDateSelect,
        visible: showCalendar,
        onClose: () => setShowCalendar(false)
      }
    )
  ] });
};
var config = {
  "navigationBarTitleText": "酒店列表",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50
};
Page(taro.createPageConfig(ListPage, "pages/list/list", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=list.js.map
