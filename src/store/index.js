import { createStore } from "vuex";
import auth from './auth';
import PRODUCT_STORE from './CRUD';
import upay from './payment';
import uFAOS from './userAddsManager'

export default createStore({
  state: {
    active: null,
    category: [
      "Omnis",
      "Real Estate",
      "Automobile",
      "Auto Parts",
      "Home & Garden",
      "Electronics",
      "Baby & Kids",
      "Education",
      "Sport",
      "Clothing",
      "Jevelry",
      "Antiques",
      "Hardware",
      "Services",
      "Trading",
    ],
    condition: ["Brand New", "Used"],
    priceCondition: ["Available", "Unavailable"],
    ukraineOblasts:[
      {
        oblast: "Vinnytsia Oblast",
        location: ["Vinnytsia", "Ladyzhyn", "Haisyn", "Zhmerynka", "Khmilnyk", "Bar", "Mohyliv-Podilskyi", "Nemyriv", "Shargorod", "Yampil"]
      },
      {
        oblast: "Volyn Oblast",
        location: ["Lutsk", "Kovel", "Novovolynsk", "Horokhiv", "Rozhyshche", "Volodymyr-Volynskyi", "Shatsk", "Ustyluh", "Turiysk", "Lyuboml"]
      },
      {
        oblast: "Dnipropetrovsk Oblast",
        location: ["Dnipro", "Kryvyi Rih", "Pavlohrad", "Novomoskovsk", "Kamianets", "Zhovti Vody", "Nikopol", "Synelnykove", "Marhanets", "Petrykivka"]
      },
      {
        oblast: "Donetsk Oblast",
        location: ["Donetsk", "Mariupol", "Sloviansk", "Kramatorsk", "Bakhmut", "Avdiivka", "Selydove", "Vuhledar", "Pokrovsk", "Yasynuvata"]
      },
      {
        oblast: "Zhytomyr Oblast",
        location: ["Zhytomyr", "Berdychiv", "Korosten", "Malyn", "Novohrad-Volynskyi", "Olevsk", "Pulyny", "Chudniv", "Ovruch", "Andrushivka"]
      },
      {
        oblast: "Zakarpattia Oblast",
        location: ["Uzhhorod", "Mukachevo", "Khust", "Berehove", "Rakhiv", "Vynohradiv", "Irshava", "Tiachiv", "Svaliava", "Mizhhirya"]
      },
      {
        oblast: "Zaporizhzhia Oblast",
        location: ["Zaporizhzhia", "Melitopol", "Berdyansk", "Enerhodar", "Tokmak", "Vasylivka", "Polohy", "Orikhiv", "Vesele", "Molochansk"]
      },
      {
        oblast: "Ivano-Frankivsk Oblast",
        location: ["Ivano-Frankivsk", "Kalush", "Kolomyia", "Bolekhiv", "Yaremche", "Dolyna", "Tysmenytsia", "Sniatyn", "Rohatyn", "Horodenka", "Delyatin", "Gonchariv"]
      },
      {
        oblast: "Kyiv Oblast",
        location: ["Kyiv", "Bila Tserkva", "Boryspil", "Bucha", "Fastiv", "Vyshhorod", "Irpin", "Brovary", "Pereiaslav", "Obukhiv"]
      },
      {
        oblast: "Kirovohrad Oblast",
        location: ["Kropyvnytskyi", "Oleksandriia", "Svitlovodsk", "Znamyanka", "Dolynska", "Novoukrainka", "Haivoron", "Bobrynets", "Mala Vyska", "Pomichna"]
      },
      {
        oblast: "Luhansk Oblast",
        location: ["Luhansk", "Severodonetsk", "Lysychansk", "Rovenky", "Kreminna", "Alchevsk", "Svatove", "Krasnyi Luch", "Pervomaisk", "Stakhanov"]
      },
      {
        oblast: "Lviv Oblast",
        location: ["Lviv", "Drohobych", "Chervonohrad", "Stryi", "Truskavets", "Sambir", "Zolochiv", "Yavoriv", "Boryslav", "Mykolaiv"]
      },
      {
        oblast: "Mykolaiv Oblast",
        location: ["Mykolaiv", "Pervomaisk", "Voznesensk", "Yuzhnoukrainsk", "Nova Odesa", "Ochakiv", "Snigurivka", "Bashtanka", "Bereznivka", "Koblevo"]
      },
      {
        oblast: "Odesa Oblast",
        location: ["Odesa", "Bilhorod-Dnistrovskyi", "Izmail", "Podilsk", "Chornomorsk", "Yuzhne", "Kiliya", "Bilyayivka", "Balta", "Arcyz"]
      },
      {
        oblast: "Poltava Oblast",
        location: ["Poltava", "Kremenchuk", "Horishni Plavni", "Lubny", "Myrhorod", "Hadiach", "Karlivka", "Piryatin", "Zinkiv", "Hlobyne"]
      },
      {
        oblast: "Rivne Oblast",
        location: ["Rivne", "Dubno", "Varash", "Kostopil", "Ostroh", "Sarny", "Zdolbuniv", "Berezne", "Radiviliv", "Rokytne"]
      },
      {
        oblast: "Sumy Oblast",
        location: ["Sumy", "Shostka", "Konotop", "Okhtyrka", "Romny", "Putyvl", "Trostianets", "Lebedyn", "Bilopillya", "Hlukhiv"]
      },
      {
        oblast: "Ternopil Oblast",
        location: ["Ternopil", "Chortkiv", "Buchach", "Kremenets", "Borshchiv", "Zbarazh", "Shumsk", "Lanivtsi", "Pidvolochysk", "Zalishchyky"]
      },
      {
        oblast: "Kharkiv Oblast",
        location: ["Kharkiv", "Lozova", "Izium", "Kupiansk", "Merefa", "Lyubotyn", "Pervomaiskyi", "Chuhuiv", "Derhachi", "Balakliia"]
      },
      {
        oblast: "Kherson Oblast",
        location: ["Kherson", "Nova Kakhovka", "Kakhovka", "Henichesk", "Skadovsk", "Oleshky", "Beryslav", "Velyka Oleksandrivka", "Kalanchak", "Chaplynka"]
      },
      {
        oblast: "Khmelnytskyi Oblast",
        location: ["Khmelnytskyi", "Kamianets-Podilskyi", "Shepetivka", "Starokostiantyniv", "Slavuta", "Polonne", "Dunaivtsi", "Netishyn", "Horodok", "Derazhnia"]
      },
      {
        oblast: "Cherkasy Oblast",
        location: ["Cherkasy", "Uman", "Smila", "Zolotonosha", "Korsun-Shevchenkivskyi", "Khrystynivka", "Kaniv", "Talne", "Vatutine", "Mankivka"]
      },
      {
        oblast: "Chernivtsi Oblast",
        location: ["Chernivtsi", "Novoselytsia", "Khotyn", "Sokyriany", "Hertsa", "Vashkivtsi", "Zastavna", "Kelmentsi", "Putyla", "Storozhynets"]
      },
      {
        oblast: "Chernihiv Oblast",
        location: ["Chernihiv", "Nizhyn", "Pryluky", "Nosivka", "Bakhmach", "Novhorod-Siverskyi", "Borzna", "Ichnia", "Koryukivka", "Mena"]
      },
      {
        oblast: "Crimea",
        location: ["Simferopol", "Yalta", "Sevastopol", "Kerch", "Feodosia", "Sudak", "Bakhchisaray", "Dzhankoy", "Evpatoria", "Saky"]
      }
    ],
    ordered: null,
    totalyOrdered:null,
    liked: [],
    toredact:null
  },
  getters: {
    getCategories(state) {
      return state.category;
    },
    getCondition(state) {
      return state.condition;
    },
    getPriceCondition(state) {
      return state.priceCondition;
    },
    getLocation(state) {
      return state.ukraineOblasts;
    },
    getActive(state) {
      return state.active;
    },
    getOrdered(state) {
      return state.ordered;
    },
    getLiked(state) {
      return state.liked;
    },
    getTotalyOrdered(state) {
      return state.totalyOrdered;
    },
    getToRedact(state) {
      return state.toredact;
    },

  },
  mutations: {
    setActive(state, id) {
      state.active = id;
    },
    setOrdered(state, id) {
      state.ordered = id;
    },
    setLiked(state, id) {
      state.liked.push(id);  
    },
    setTotalyOrdered(state, id) {
      state.totalyOrdered = id;
    },
    setToRedact(state, id) {
      state.toredact = id;
    },
  },
  actions: {
    setAction({ commit }, id) {
      commit('setActive', id);
    },
    setOrder({ commit }, id) {
      commit('setOrdered', id);
    },
    setMyLiked({ commit }, id) {
      commit('setLiked', id);  
    },
    setTotalyOrder({ commit }, id) {
      commit('setTotalyOrdered', id);
    },
    setRedact({ commit }, id) {
      commit('setToRedact', id);
    },
  },
  modules: {
    auth,
    PRODUCT_STORE,
    upay,
    uFAOS
  }
});
