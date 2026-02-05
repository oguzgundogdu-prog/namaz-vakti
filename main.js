// DOM Elements
const locationNameEl = document.getElementById('location-name');
const dateDisplayEl = document.getElementById('date-display');
const nextPrayerNameEl = document.getElementById('next-prayer-name');
const countdownEl = document.getElementById('countdown');
const prayerTimesListEl = document.getElementById('prayer-times-list');
const nafileListEl = document.getElementById('nafile-list');

// Scholar Photos - Array of available photos
const SCHOLAR_PHOTOS = [
  '/namaz-vakti/assets/scholar.jpg',
  '/namaz-vakti/assets/scholar-1.jpg',
  '/namaz-vakti/assets/scholar-2.jpg',
  '/namaz-vakti/assets/scholar-3.jpg',
  '/namaz-vakti/assets/scholar-4.jpg',
  '/namaz-vakti/assets/scholar-5.jpg'
];

// Scholar Quotes
const SCHOLAR_QUOTES = [
  // Yeni eklenenler (Resim 5)
  { text: 'Asıl insanları kurtaracak, insanları büyük şereflere ulaştıracak bu Kur\'ân-ı Azîmüşşan\'dır. İnsan: “Ben bunu almadan âhirete gitmeyeceğim, ben bunu anlamadan bunun sahibinin huzuruna çıkmayacağım” demelidir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Soruyorum onlara: “En büyük kim?” diye: “Allâh-u Teâlâ” diyolar, “En büyük kitap hangisi?” deyince: “Kur\'ân-ı Kerîm” diyorlar. “En büyük insan kim?” dediğimde ise onu söyleyemiyorlar, korkuyorlar söylemeye. Tabî ki Allâh-u Teâlâ\'nın gönderdiği Kur\'ân-ı Kerîm\'i okuyan kişidir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Avrupalılar ve Amerikalılar diyorlar ki: “Türkler Kur\'ân\'a ve mürşidlere inandıkları için illa bizi yeniyorlar. Türkleri bundan uzaklaştıralım, o zaman onlar sarhoş gibi olurlar.” Böylece onlar bizi Kur\'ân\'dan ayırdılar. Şimdi hep geriye gidiyoruz. Önceden Viyana\'ya kadar ilerleyen bizler, şimdi geriye gidiyoruz. Onlar bizim ilerlememizin Kur\'ân\'la olduğunu biliyorlar. Biz ise bilmiyoruz, çok cahil kalmışız.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bugün besmelesiz, nursuz, feyizsiz kitapları okursun ama Kur\'ân bulunduğu yerden sana sesleniyor: “Bana bak” diye. Sen ise ona: “Benim işim var, Yunan felsefesine bakacağım” diyorsun. Tekrar Kur\'ân sana diyor ki: “Ben kimden geldim biliyor musun?” Sen de: “Kur\'ân! Hele sen dur yerinde, ben şimdi sana bakamam” diyorsun. Kur\'ân yine sesleniyor: “Benim içimde ne var biliyor musun?” Sen yine Kur\'ân\'ın tarafına bakmıyorsun. Sen Kur\'ân-ı terk edip ona bakmıyorsun, o da âhirette senin tarafına bakmayacak.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bana gelip: “Hoca efendi Kur\'ân-ı Kerîm\'i hatmettim, duasını eder misin?” diyorlar. Peki, hatmettiler fakat hangi âyetini anladılar acaba?! Efendi Babam (Kuddise Sirruhû): “Bir âyetin manasını öğrenmek kadar güzel şey yoktur” derdi. Cemaat-i Müslimîn! Bu ihtarlardan sonra âyetin manasını düşüneceğiz inşâallâh, neden dayak cennetten çıktı, dayak yemeyen pek adam olamaz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  // Yeni eklenenler (Resim 4)
  { text: 'İç karışıklıklar günden güne alevleniyor. Türkiye\'ye eğer bir şey olmuyorsa sizin çarşaflarınız yüzünden! Ama severek giyeceksiniz. Bazıları var: “Bir yasak olsaydı da çıkarsaydık” derler.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir gâvura bir milyar versen çarşaf giymez, bizim Müslümanlar ise bir milyar verip gâvurun mantosunu giyiyorlar.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Millete beğenilmeye çalışmayalım. Çarşafı kale yapıp içine giren mahfuzdur.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaf aşksız, muhabbetsiz giyilmez.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaf giyen Allâh\'ın pehlivan kuludur.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir hanıma İstanbul\'u versem çarşaf giyemez ama giyince de çıkarmaz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Sakala razı olmazmış, çarşafa, örtünmeye razı olmazmış. Sen bilirsin! Nazlılık devirleri geçer bir gün. Ey insan! Âyetlerden ders al ders. Kütük olma, sallan biraz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Hanımlara: “Çarşafla örtününüz, elbiseleriniz ermeni entarisi gibi olmasın” denildi. Ne demeli? Peki.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Vücudunuzdan derileriniz yolunsa (soyulsa) yine de çıkarmayacaksınız.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir çarşaf bütün dünyaya bedeldir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Sen çarşafınla beraber berberden yeni çıkmış en süslü hanımdan daha güzelsin.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Her şeyin bir nişanı vardır. Çarşaf da İslâm\'ın nişanıdır.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaflı eğer çarşafın kıymetini bilirse cihan ona dokunamaz, dokunsa cihan yıkılır.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaf giyen kişi belki nice insanların gözünden düşer. Onların gözünden düşer ama evliyâullâhın gözüne girer. Tavuk kümesinden çıkar ve daimî saraya girer.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  // Yeni eklenenler (Resim 3)
  { text: 'Mahmud\'un hasta olduğunu duyarsanız, bir kadın çarşafını çıkarmış da ondandır öyle bilin.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Şu çarşafı çıkaranlar var ya onları duyunca sanki kalbime hançer sokuyorlar gibi oluyorum, devam edenler de yarama ilaç oluyorlar. Ben onlardan razı olduğumdan ziyade, Allâh onlardan razı olsun.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İçimiz de dışımız da İslâm\'a uyacak. Kopuklar nasıl yürüyorsa, öyle yürüyenler var. Çarşaflılar! Şunu unutmayın, bütün çarşaflılar hoca niyeti ile görülüyor.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşafı seçen Mevlâ Teâlâ\'nın rızasını, mantoyu seçen Mevlâ Teâlâ\'nın gazabını seçmiştir. Öyleyse iyi tarafı seçmek lazımdır.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaflı kardeşlerimizden birisi, bir diş doktoruna gitmiş, ertesi gün tekrar gittiğinde çarşaf ile uzaktan yakından alakası olmayan doktor: “Bana bu gece rüyamda şu çarşaftan düşen tozları muhafaza edin, onlar size yardım edecek denildi” demiş.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Allâh-u Teâlâ çarşafın değerini dünyada ortaya çıkarmıyor. Eğer çarşafın ne kadar kıymetli olduğu hakikati gözükse idi, bütün hanımlar illa çarşaf giyeceğiz diye harp ederlerdi, gözükmediği için giyilmemesi için harp ediyorlar.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaf giyinmeyen hanım tehlikelidir, tehlikelidir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir hanım kardeşimiz çarşaf giyse, bütün komşuları ona düşman olur. Ona: “Sadece sen mi cennete gideceksin?!” derler. Sanki o: “Sadece ben cennete gideceğim, hiçbiriniz gidemeyecek!” demiş oluyor. Halbuki öyle mi diyor?! Yok, iftira ediyorsunuz ona, sû-i zan ediyorsunuz, “Kendini beğenmiş” diyorsunuz. Yalan, kendini beğendiği yok, kendini toprak ediyor, toprak.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaf giyenler cahiller tarafından beğenilmez. Ama o: “İsterse beni Allâh yolunda beğenmesinler” diyor, kendini feda ediyor.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaf hakkında çok tenbih edelim, çok tenbih edelim ama hanımların canını yakmayalım. Yarın hakkını alacak senden âhirette. Erkek olarak, eline düştü diye yiyecek misin onu?! Zorun nedir?! Her şey yumuşaklıkla!', author: 'Mahmud Efendi Kuddise Sirruhu' },
  // Yeni eklenenler (Resim 2)
  { text: 'Bu yolda ölmeye geldik, okumaya devam.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Hepinizden memnunum ama ilim okuyanlardan daha çok memnunum.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İngilizce, Almanca, Fransızca bilirsiniz, Arapça bilmezsiniz. Eyvah eyvah! Hem de ne kadar eyvah!', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: '« كُلُّ حَافِظٍ جَاهِلٌ » Her hafız (ilim tahsil etmedikçe) cahildir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İlim fazlalaştıkça, ışığın artması gibi insanın kendi suçlarını görmesi lazım. O zaman kendini beğenmeye ve iftihara meydan kalmaz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bize çok hoca lazım. Dünyayı sevmeyen hoca.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Arkadaşlar! Diploma meraklısı olmayalım. İcazet meraklısı olalım. İlim bitirme meraklısı olalım.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Ateşin içinde sen gülistanda oturuyorsun. (Arapça okuyanlar için buyurdular.)', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir hoca, talebesinin hem hocası, hem müdiresi, hem ablası, hem de annesi olmalı. (Kadınlara yaptığı vaazda)', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İlmin neticesi olmayan bir hal, ne kadar büyük ve önemli olursa olsun, sahibine menfaatten çok zarar verir.', author: 'Mahmud Efendi Kuddise Sirruhu' },

  // Yeni eklenenler
  { text: 'Namazı vaktinde cemaatle kılalım, ondan sonra tesbihinizi çekeceksiniz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Yumurtanız burada beş kuruş, Beykoz\'da yirmi beş kuruş olsa, yemin ederim Beykoz\'da satarsınız. Peki namazı nasıl evde (kılar da ucuza) satarsın.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Dünya senin esirin olsun, niye sen onun esiri oluyorsun?! Sen ona bin, o sana niye biniyor?! Namazını cemaatle kıldıysan sen ona bindin. Malının zekatını verdiysen sen ona bindin.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Cemaatsiz kılınan namaz nâkıstır.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Cemaatle bir vakit namaz kılmayı kaçırsanız, kalbinize o miktar katılık gelir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir zamanlar Rus hükümeti Müslümanlara: “Camilerde görev yapan imamlara maaş veriyoruz, siz ise namaz kılmaya gitmiyorsunuz, gelin namazlarınızı camide kılın! Eğer gelmezseniz camilerinizi ibadete kapatırız” diyerek ihtarda bulundu. Lakin bu ihtara da kulak verilmedi, sonunda bütün camiler kapatıldı. Mescid-i Aksâ bugün kimlerin elindedir? Yahudilerin. Neden? Çünkü orada bulunan Müslümanların büyük bir çoğunluğu Mescid-i Aksâ’ya namaza gitmiyorlardı da ondan. Ancak başka ülkelerden ziyaret maksadıyla gelen bir kaç Müslüman orada namaz kılardı, Mevlâ Teâlâ da ceza kabilinden Müslümanların elinden Mescid-i Aksâ’yı aldı. İslâm’ı hayatlarına tatbik etmekten üşenen kavim, Bosna Hersek’in belasına uğrar. Medreselerde öyle talebeler hocalar var ki sarf, nahiv, tefsir, hadis okuyor, okutuyor fakat namaz kılmıyor, bu olur mu hiç?!', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Ezan-ı şerîf Allâh (Celle Celâlühü)nün davetiyesidir. Câmiye gelince icabet olur, câmiye gelmedin, evde de kılmadın peki nasıl cenneti istiyorsun?! Medreseye hiç gelmedin! Çok güzel olan cennet, çok güzel para ister.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Dükkanı kapatmayalım ama namazları camide cemaatle kılalım.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Seve seve şeriatı yaşayalım. Şeriatın mühim meselelerindendir namazı camide cemaatle kılmak.', author: 'Mahmud Efendi Kuddise Sirruhu' },

  // Mevcutlar (Güncellenmiş isimle)
  { text: 'Gelirsiniz ver bana tarikat, sonra bırakırsınız, namaza başlar, bırakırsınız, çarşafı giyer, çıkarırsınız.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Şalvar giymekten utanırsınız, sakal, cübbe, çarşaf, uzun entari, bakın İslam kıyafetidir bu. Sen bunları giymekle "ben Müslüman\'ım, benim sağlığımda islamiyete kimse yan bakamaz" demek istiyorsun.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaflarınızı muhafaza ediyorsunuz Elhamdülillah, ama bilmiyorum entarileriniz nasıldır?', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Kadınların şerefi gizli kalmalarında ve erkeklerle görüşmemelerindedir. Kadın çalışacak diye tutturmuş, sonra aç kalırlarmış. Sen karışmasana, o Allahu Teala yarattığının rızkını verir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Sizin çarşafınız bizim sarığımız, şalvarımız, sizi gören alacağını alıyor, birde tatlı sözlen konuşursan onunla, tamam.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Dilenci at üstünde gelse vereceksin, şüpheleniyorsan az ver, şüphelenmiyorsan çok ver.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Aklı başında olan adamın evinde televizyon olmaz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'En büyük günah sorulursa, nedir? Kafirlere meyletmektir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Karınca bacağı kadar olsa bile ekmek atmayın, bu bizi helak eder.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Televizyon hiç Mevla\'yı hatırlatır mı? Zehir zakkum akıtıyor.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Ruh ile beden bir olmazsa bir milyon kere Allah (c.c) desen boş.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşaf giymekle büyük yiğitlik yapıyorsunuz, milletin tesettüre heves etmesine sebep oluyorsunuz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Çarşafınızı iyi muhafaza edin. Şunu yakinen bilin ki; bir çarşafı, bir sarığı bozmakla Çeçenistan\'a gelen belayı bize de verebilir Cenab-ı hak.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Can vermeli çarşaftan vazgeçmemeli, ne güzel şeydir o.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bu çarşafı giyen hanımlar, bilseler onların sayesinde neler oluyor, yatarken de giyerler. Siz ki Allah için tesettürünüzü muhafaza ettiniz O da sizi muhafaza eder.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir Hoca yüzbin televizyondan daha tesirlidir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Rabıta muhabbetle olur, muhabbette ittiba ile olur. İttiba edersen seversin ve sevilirsin.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Mektubattan uzak kalındığı an feyiz kesilir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Sarığı kabul etmeyenin Peygamberimiz (s.a.v.), Cebrail (a.s.), Allah-u Teala (c.c.)\'de kabul etmiyor.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Dünya içinde herşey melundur, fakat zikrullah ile meşgul olan emri bil maruf nehy-i anil münker yapan okuyan ve okutan değildir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Avrupa modasına uymak, namazı terk etmekten daha ağır geliyor.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Televizyon seyreden dinini sevmiyor demektir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir kimse asılacağından korktuğu gibi imandan küfre döneceğinden de öyle korkacak.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Sen nefsini hak ile meşgul etmezsen, nefis seni batıl ile meşgul eder.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir kimse emri bil maruf yapacağım diye yola çıksa sonra siyasetten bahsetse, onun azabını kimse ölçemez.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Dünya sevgisi insanı şaraptan daha sarhoş eder ve ateşe girmeye cesaret verir.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Kalın kafalı nefse uyarsan her yerde rezilsin.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İnsan bir nefes sağ olsa çok ilerler.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bütün haramlar nefse dostluk, Mevla\'ya (c.c.) düşmanlıktır.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Gezdiğimiz yerlerde talebe var, medrese yapacak para yok. Milyarlar gidiyor başka yerlere ama medreseye para yok. Bunların hepsi ahirette acısını çekecek.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İlim, amel, ihlas. Üçü bir arada olsun, bunları cemet, dünyayı fethedersin.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İnsanlar et gibi, ulemâ tuz gibidir. Tuzsuz et koktuğu gibi, ulemâdan ve onların sohbetinden mahrum kalanlar da kokar.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Ey talebeler! Sizler kurumuş toprakların yağmur yüklü bulutlarısınız. Direksiz kubbelerin direklerisiniz.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bugünkü tahsil ölümden ötesini haber vermiyor. Buna siz nasıl yüksek tahsil dersiniz?', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bir adam bir kişiye Kur\'ân okutsa bütün dünyaya bedeldir. Bize Kur\'ân okuyup okutmak ufak bir şey mi geliyor?', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Bilgisiz bir kimse savaş davuluna benzer; sesi çoktur, içi boştur.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İki kişi iki kişiyi kıskanmaz; baba oğlunu, hoca talebesini.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'Hocaların bir âdeti var: bir âyeti okusalar veya dinleseler, söylemek için hemen cemaat gelir hatırına. Halbuki hatırına önce kendini getirmeli. Farkında değil, başkalarına iyilik edecek, kendini yakacak.', author: 'Mahmud Efendi Kuddise Sirruhu' },
  { text: 'İlmi olup da okutmayan, evlerinde boş boş oturan hoca hanımlar keşke iki talebe de olsa okutsaydım da âhirete ev hanımı vasfında gelmeseydim diyecek, bu yola hizmet etmediklerine çok pişman olacaklar.', author: 'Mahmud Efendi Kuddise Sirruhu' }
];

// Function to set random scholar photo
function setRandomScholarPhoto() {
  const randomIndex = Math.floor(Math.random() * SCHOLAR_PHOTOS.length);
  // Add timestamp to prevent caching
  const photoPath = SCHOLAR_PHOTOS[randomIndex] + '?v=' + new Date().getTime();
  const portraitImg = document.querySelector('.portrait-frame img');

  if (portraitImg) {
    portraitImg.src = photoPath;
    portraitImg.alt = 'Mahmud Efendi Hazretleri';
  }
}

// Configuration
const API_URL = 'https://api.aladhan.com/v1/timings';
const CALCULATION_METHOD = 13; // Diyanet İşleri Başkanlığı
const PRAYER_NAMES_TR = {
  Tahajjud: 'Teheccüd',
  Fajr: 'İmsak',
  Sunrise: 'Güneş',
  Dhuhr: 'Öğle',
  Asr: 'İkindi',
  Maghrib: 'Akşam',
  Isha: 'Yatsı'
};

const ORDERED_PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// State
let prayerData = null;
let nextPrayerTime = null;
let countdownInterval = null;
let nafileTimes = {};

// Initialize
async function init() {
  // Set random scholar photo on each launch
  setRandomScholarPhoto();

  updateDateDisplay();

  try {
    const position = await getPosition();
    const { latitude, longitude } = position.coords;
    // Save coordinates for sidebar calendar
    userCoordinates = { latitude, longitude };
    await fetchPrayerTimes(latitude, longitude);
    await getLocationName(latitude, longitude);
  } catch (error) {
    console.error('Konum hatası:', error);
    locationNameEl.textContent = 'İstanbul';
    // Fallback to Istanbul coordinates
    userCoordinates = { latitude: 41.0082, longitude: 28.9784 };
    await fetchPrayerTimes(41.0082, 28.9784);
  }
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

async function getLocationName(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=tr`
    );
    const data = await response.json();

    if (data && data.address) {
      const city = data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        'İstanbul';
      locationNameEl.textContent = city;
    }
  } catch (error) {
    console.error('Konum ismi alınamadı:', error);
    // Keep default or existing location name
  }
}

async function fetchPrayerTimes(latitude, longitude) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `${API_URL}/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${CALCULATION_METHOD}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200) {
      prayerData = data.data;
      calculateTahajjud();
      calculateNafileTimes();
      renderPrayerTimes();
      renderNafilePrayers();
      setupCountdown();

      // Location name will be updated by getLocationName function
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.error('Namaz vakitleri alınamadı:', error);
    prayerTimesListEl.innerHTML = '<p style="text-align:center;">Veriler yüklenemedi. Lütfen tekrar deneyin.</p>';
  }
}

function calculateTahajjud() {
  if (!prayerData || !prayerData.timings) return;

  // Get Fajr (İmsak) time
  const fajrTime = prayerData.timings.Fajr;
  const [hours, minutes] = fajrTime.split(':').map(Number);

  // Calculate Tahajjud: 60 minutes before Fajr
  const fajrDate = new Date();
  fajrDate.setHours(hours, minutes, 0, 0);

  const tahajjudDate = new Date(fajrDate.getTime() - 60 * 60 * 1000); // Subtract 60 minutes

  // Format as HH:MM
  const tahajjudHours = tahajjudDate.getHours().toString().padStart(2, '0');
  const tahajjudMinutes = tahajjudDate.getMinutes().toString().padStart(2, '0');

  // Add Tahajjud to timings
  prayerData.timings.Tahajjud = `${tahajjudHours}:${tahajjudMinutes}`;
}

function renderPrayerTimes() {
  if (!prayerData) return;

  const timings = prayerData.timings;
  const now = new Date();

  prayerTimesListEl.innerHTML = ORDERED_PRAYERS.map((prayer) => {
    const timeStr = timings[prayer];
    const [hours, minutes] = timeStr.split(':').map(Number);

    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    const isPast = prayerTime < now;

    return `
      <div class="prayer-item ${isPast ? 'past' : ''}" data-prayer="${prayer}">
        <span class="prayer-name">${PRAYER_NAMES_TR[prayer]}</span>
        <span class="prayer-time">${timeStr}</span>
      </div>
    `;
  }).join('');
}

function setupCountdown() {
  if (!prayerData) return;

  const timings = prayerData.timings;
  const now = new Date();

  // Find next prayer
  let nextPrayer = null;
  let isTomorrow = false;

  for (const prayer of ORDERED_PRAYERS) {
    const timeStr = timings[prayer];
    const [hours, minutes] = timeStr.split(':').map(Number);

    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    if (prayerTime > now) {
      nextPrayer = { key: prayer, time: prayerTime };
      break;
    }
  }

  // If no prayer found for today, next is first prayer tomorrow
  if (!nextPrayer) {
    const firstPrayer = ORDERED_PRAYERS[0];
    const timeStr = timings[firstPrayer];
    const [hours, minutes] = timeStr.split(':').map(Number);

    const prayerTime = new Date();
    prayerTime.setDate(prayerTime.getDate() + 1);
    prayerTime.setHours(hours, minutes, 0, 0);

    nextPrayer = { key: firstPrayer, time: prayerTime };
    isTomorrow = true;
  }

  nextPrayerTime = nextPrayer.time;

  // Highlight next prayer
  document.querySelectorAll('.prayer-item').forEach(item => {
    if (item.dataset.prayer === nextPrayer.key && !isTomorrow) {
      item.classList.add('active');
    }
  });

  // Update countdown
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  updateCountdown(nextPrayer.key, isTomorrow);
  countdownInterval = setInterval(() => updateCountdown(nextPrayer.key, isTomorrow), 1000);
}

function updateCountdown(nextPrayerKey, isTomorrow) {
  const now = new Date();
  const timeDiff = nextPrayerTime - now;

  if (timeDiff < 0) {
    // Should re-run logic if time passed during interval
    // For now simple reload trigger or re-calc
    setupCountdown();
    return;
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  countdownEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const nextName = PRAYER_NAMES_TR[nextPrayerKey];
  nextPrayerNameEl.textContent = isTomorrow ? `${nextName} (Yarın)` : nextName;
}

function updateDateDisplay() {
  const now = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const dateStr = now.toLocaleDateString('tr-TR', options);
  dateDisplayEl.textContent = dateStr;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

// Tab Switching
function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  if (!buttons || buttons.length === 0) {
    console.warn('Tab buttons not found');
    return;
  }

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');

      // Remove active from all
      buttons.forEach(btn => btn.classList.remove('active'));
      contents.forEach(content => content.classList.remove('active'));

      // Add active to clicked
      this.classList.add('active');
      const target = document.getElementById(tabName + '-content');
      if (target) {
        target.classList.add('active');
      }
    });
  });
}

// Calculate Nafile Prayer Times
function calculateNafileTimes() {
  if (!prayerData || !prayerData.timings) return;

  const timings = prayerData.timings;

  // İşrak: 15-20 dakika after sunrise
  const sunriseTime = parseTime(timings.Sunrise);
  const israkTime = new Date(sunriseTime.getTime() + 20 * 60 * 1000);

  // Kuşluk: Fixed time 10:30
  const kuslukTime = new Date();
  kuslukTime.setHours(10, 30, 0, 0);

  // Evvabin: Between Maghrib and Isha (Maghrib + 15 mins)
  const maghribTime = parseTime(timings.Maghrib);
  const evvabinTime = new Date(maghribTime.getTime() + 15 * 60 * 1000);

  nafileTimes = {
    israk: formatTime(israkTime),
    kusluk: formatTime(kuslukTime),
    evvabin: formatTime(evvabinTime)
  };
}

// Parse time string to Date object
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Format Date object to HH:MM
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Render Nafile Prayers
function renderNafilePrayers() {
  const nafileData = [
    { id: 'teheccud', name: 'Teheccüd', time: prayerData?.timings?.Tahajjud || '--:--', description: 'İmsak\'tan 1 saat önce' },
    { id: 'israk', name: 'İşrak', time: nafileTimes.israk, description: 'Güneş doğduktan 20 dk sonra' },
    { id: 'kusluk', name: 'Kuşluk', time: nafileTimes.kusluk, description: 'Sabah ortası' },
    { id: 'evvabin', name: 'Evvabin', time: nafileTimes.evvabin, description: 'Akşam-Yatsı arası' }
  ];

  const checkboxStates = loadCheckboxStates();

  nafileListEl.innerHTML = nafileData.map(prayer => {
    const isChecked = checkboxStates[prayer.id] || false;
    const completedClass = isChecked ? 'completed' : '';

    return `
      <div class="nafile-item ${completedClass}" data-prayer-id="${prayer.id}">
        <div class="nafile-item-info">
          <div class="nafile-name">${prayer.name}</div>
          <div class="nafile-time">${prayer.time} - ${prayer.description}</div>
        </div>
        <label class="nafile-checkbox">
          <input type="checkbox" id="nafile-${prayer.id}" name="nafile-${prayer.id}" ${isChecked ? 'checked' : ''} onchange="handleNafileCheckbox('${prayer.id}', this.checked)">
          <span class="checkbox-custom"></span>
        </label>
      </div>
    `;
  }).join('');
}

// Handle Checkbox Change
function handleNafileCheckbox(prayerId, isChecked) {
  saveCheckboxState(prayerId, isChecked);

  const item = document.querySelector(`[data-prayer-id="${prayerId}"]`);
  if (isChecked) {
    item.classList.add('completed');
  } else {
    item.classList.remove('completed');
  }
}

// Save Checkbox State to localStorage
function saveCheckboxState(prayerId, isChecked) {
  const states = loadCheckboxStates();
  states[prayerId] = isChecked;
  localStorage.setItem('nafileCheckboxes', JSON.stringify(states));
}

// Load Checkbox States from localStorage
function loadCheckboxStates() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('nafileCheckboxes');
  const storedDate = localStorage.getItem('nafileCheckboxesDate');

  // Reset if new day
  if (storedDate !== today) {
    localStorage.setItem('nafileCheckboxesDate', today);
    localStorage.removeItem('nafileCheckboxes');
    return {};
  }

  return stored ? JSON.parse(stored) : {};
}

// Make handleNafileCheckbox global for onclick attribute
window.handleNafileCheckbox = handleNafileCheckbox;

// ============================================
// Settings Sidebar
// ============================================

// Sidebar State
let currentCalendarMonth = new Date().getMonth(); // 0-11
let currentCalendarYear = new Date().getFullYear();
let calendarData = null;
let userCoordinates = { latitude: 41.0082, longitude: 28.9784 }; // Default Istanbul

// Sidebar Elements
const settingsBtn = document.getElementById('settings-btn');
const sidebar = document.getElementById('settings-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const sidebarTabBtns = document.querySelectorAll('.sidebar-tab-btn');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const currentMonthDisplay = document.getElementById('current-month-display');
const calendarTbody = document.getElementById('calendar-tbody');
const quotesList = document.getElementById('quotes-list');

// Open Sidebar
function openSidebar() {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Sidebar
function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Event Listeners
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    openSidebar();
    // Load calendar on first open
    if (!calendarData) {
      fetchMonthlyCalendar(currentCalendarYear, currentCalendarMonth + 1);
    }
    // Load quotes on first open
    if (quotesList && quotesList.children.length === 0) {
      renderQuotes();
    }
  });
}

if (sidebarCloseBtn) {
  sidebarCloseBtn.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// Sidebar Tab Switching
sidebarTabBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const tabName = this.getAttribute('data-sidebar-tab');

    // Remove active from all
    sidebarTabBtns.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Add active to clicked
    this.classList.add('active');
    const targetContent = document.getElementById(tabName + '-content');
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// Month Navigation
if (prevMonthBtn) {
  prevMonthBtn.addEventListener('click', () => {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear--;
    }
    fetchMonthlyCalendar(currentCalendarYear, currentCalendarMonth + 1);
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener('click', () => {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear++;
    }
    fetchMonthlyCalendar(currentCalendarYear, currentCalendarMonth + 1);
  });
}

// Fetch Monthly Calendar
async function fetchMonthlyCalendar(year, month) {
  try {
    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${userCoordinates.latitude}&longitude=${userCoordinates.longitude}&method=${CALCULATION_METHOD}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200 && data.data) {
      calendarData = data.data;
      renderCalendar();
      updateMonthDisplay();
    } else {
      throw new Error('Calendar API error');
    }
  } catch (error) {
    console.error('Aylık takvim yüklenemedi:', error);
    if (calendarTbody) {
      calendarTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">Takvim yüklenemedi</td></tr>';
    }
  }
}

// Clean time format (remove timezone like +03:00)
function cleanTime(timeStr) {
  if (!timeStr) return '--:--';
  // Remove everything after space (like " (UTC+3)" or " +03:00")
  return timeStr.split(' ')[0];
}

// Render Calendar Table
function renderCalendar() {
  if (!calendarData || !calendarTbody) return;

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const isCurrentMonth = currentCalendarMonth === todayMonth && currentCalendarYear === todayYear;

  calendarTbody.innerHTML = calendarData.map((dayData, index) => {
    const timings = dayData.timings;
    const day = index + 1;
    const isToday = isCurrentMonth && day === todayDay;

    return `
      <tr class="${isToday ? 'today' : ''}">
        <td>${day}</td>
        <td>${cleanTime(timings.Fajr)}</td>
        <td>${cleanTime(timings.Sunrise)}</td>
        <td>${cleanTime(timings.Dhuhr)}</td>
        <td>${cleanTime(timings.Asr)}</td>
        <td>${cleanTime(timings.Maghrib)}</td>
        <td>${cleanTime(timings.Isha)}</td>
      </tr>
    `;
  }).join('');
}

// Update Month Display
function updateMonthDisplay() {
  if (!currentMonthDisplay) return;

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  currentMonthDisplay.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
}

// Render Quotes
function renderQuotes() {
  if (!quotesList) return;

  // Rastgele karıştırma (Fisher-Yates shuffle)
  const shuffledQuotes = [...SCHOLAR_QUOTES];
  for (let i = shuffledQuotes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuotes[i], shuffledQuotes[j]] = [shuffledQuotes[j], shuffledQuotes[i]];
  }

  quotesList.innerHTML = shuffledQuotes.map(quote => `
    <div class="quote-card">
      <div class="quote-content">
        <i class="fas fa-quote-left quote-icon"></i>
        <p class="quote-text">"${quote.text}"</p>
        <div class="quote-author-container">
          <span class="quote-line"></span>
          <p class="quote-author">${quote.author}</p>
        </div>
      </div>
      <div class="quote-actions">
        <button class="quote-action-btn copy-btn" onclick="copyQuote('${quote.text.replace(/'/g, "\\'")}', '${quote.author.replace(/'/g, "\\'")}')" title="Kopyala">
          <i class="fas fa-copy"></i>
        </button>
        <button class="quote-action-btn share-btn" onclick="shareQuote('${quote.text.replace(/'/g, "\\'")}', '${quote.author.replace(/'/g, "\\'")}')" title="Paylaş">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    </div>
  `).join('');

  // Setup Intersection Observer for animations
  setupQuoteObserver();
}


// Update user coordinates when location is fetched
async function fetchPrayerTimesWithCoords(latitude, longitude) {
  userCoordinates.latitude = latitude;
  userCoordinates.longitude = longitude;
  await fetchPrayerTimes(latitude, longitude);
}

// ============================================
// Daily Quote Modal
// ============================================

const quoteModalOverlay = document.getElementById('quote-modal-overlay');
const quoteModalClose = document.getElementById('quote-modal-close');
const quoteModalText = document.getElementById('quote-modal-text');

// Get all quotes (new implementation using global constant)
function getAllQuotes() {
  return SCHOLAR_QUOTES;
}

// Get all quotes (old implementation - deprecated)
function getAllQuotes_OLD() {
  return [
    {
      text: 'Gelirsiniz ver bana tarikat, sonra bırakırsınız, namaza başlar, bırakırsınız, çarşafı giyer, çıkarırsınız.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Şalvar giymekten utanırsınız, sakal, cübbe, çarşaf, uzun entari, bakın İslam kıyafetidir bu. Sen bunları giymekle "ben Müslüman\'ım, benim sağlığımda islamiyete kimse yan bakamaz" demek istiyorsun.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşaflarınızı muhafaza ediyorsunuz Elhamdülillah, ama bilmiyorum entarileriniz nasıldır?',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Kadınların şerefi gizli kalmalarında ve erkeklerle görüşmemelerindedir. Kadın çalışacak diye tutturmuş, sonra aç kalırlarmış. Sen karışmasana, o Allahu Teala yarattığının rızkını verir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sizin çarşafınız bizim sarığımız, şalvarımız, sizi gören alacağını alıyor, birde tatlı sözlen konuşursan onunla, tamam.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dilenci at üstünde gelse vereceksin, şüpheleniyorsan az ver, şüphelenmiyorsan çok ver.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Aklı başında olan adamın evinde televizyon olmaz.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'En büyük günah sorulursa, nedir? Kafirlere meyletmektir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Karınca bacağı kadar olsa bile ekmek atmayın, bu bizi helak eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Televizyon hiç Mevla\'yı hatırlatır mı? Zehir zakkum akıtıyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Ruh ile beden bir olmazsa bir milyon kere Allah (c.c) desen boş.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşaf giymekle büyük yiğitlik yapıyorsunuz, milletin tesettüre heves etmesine sebep oluyorsunuz.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Çarşafınızı iyi muhafaza edin. Şunu yakinen bilin ki; bir çarşafı, bir sarığı bozmakla Çeçenistan\'a gelen belayı bize de verebilir Cenab-ı hak.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Can vermeli çarşaftan vazgeçmemeli, ne güzel şeydir o.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bu çarşafı giyen hanımlar, bilseler onların sayesinde neler oluyor, yatarken de giyerler. Siz ki Allah için tesettürünüzü muhafaza ettiniz O da sizi muhafaza eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir Hoca yüzbin televizyondan daha tesirlidir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Rabıta muhabbetle olur, muhabbette ittiba ile olur. İttiba edersen seversin ve sevilirsin.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Mektubattan uzak kalındığı an feyiz kesilir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sarığı kabul etmeyenin Peygamberimiz (s.a.v.), Cebrail (a.s.), Allah-u Teala (c.c.)\'de kabul etmiyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dünya içinde herşey melundur, fakat zikrullah ile meşgul olan emri bil maruf nehy-i anil münker yapan okuyan ve okutan değildir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Avrupa modasına uymak, namazı terk etmekten daha ağır geliyor.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Televizyon seyreden dinini sevmiyor demektir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir kimse asılacağından korktuğu gibi imandan küfre döneceğinden de öyle korkacak.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Sen nefsini hak ile meşgul etmezsen, nefis seni batıl ile meşgul eder.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir kimse emri bil maruf yapacağım diye yola çıksa sonra siyasetten bahsetse, onun azabını kimse ölçemez.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Dünya sevgisi insanı şaraptan daha sarhoş eder ve ateşe girmeye cesaret verir.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Kalın kafalı nefse uyarsan her yerde rezilsin.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'İnsan bir nefes sağ olsa çok ilerler.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bütün haramlar nefse dostluk, Mevla\'ya (c.c.) düşmanlıktır.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Gezdiğimiz yerlerde talebe var, medrese yapacak para yok. Milyarlar gidiyor başka yerlere ama medreseye para yok. Bunların hepsi ahirette acısını çekecek.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'İlim, amel, ihlas. Üçü bir arada olsun, bunları cemet, dünyayı fethedersin.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'İnsanlar et gibi, ulemâ tuz gibidir. Tuzsuz et koktuğu gibi, ulemâdan ve onların sohbetinden mahrum kalanlar da kokar.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Ey talebeler! Sizler kurumuş toprakların yağmur yüklü bulutlarısınız. Direksiz kubbelerin direklerisiniz.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bugünkü tahsil ölümden ötesini haber vermiyor. Buna siz nasıl yüksek tahsil dersiniz?',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bir adam bir kişiye Kur\'ân okutsa bütün dünyaya bedeldir. Bize Kur\'ân okuyup okutmak ufak bir şey mi geliyor?',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Bilgisiz bir kimse savaş davuluna benzer; sesi çoktur, içi boştur.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'İki kişi iki kişiyi kıskanmaz; baba oğlunu, hoca talebesini.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'Hocaların bir âdeti var: bir âyeti okusalar veya dinleseler, söylemek için hemen cemaat gelir hatırına. Halbuki hatırına önce kendini getirmeli. Farkında değil, başkalarına iyilik edecek, kendini yakacak.',
      author: 'Mahmud Efendi (k.s)'
    },
    {
      text: 'İlmi olup da okutmayan, evlerinde boş boş oturan hoca hanımlar keşke iki talebe de olsa okutsaydım da âhirete ev hanımı vasfında gelmeseydim diyecek, bu yola hizmet etmediklerine çok pişman olacaklar.',
      author: 'Mahmud Efendi (k.s)'
    }
  ];
}

// Show random quote on page load
function showDailyQuote() {
  const allQuotes = getAllQuotes();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  const randomQuote = allQuotes[randomIndex];

  if (quoteModalText) {
    quoteModalText.textContent = randomQuote.text;
  }

  // Bind share button
  const shareBtn = document.getElementById('modal-share-btn');
  if (shareBtn) {
    // Remove old listeners by cloning or just setting onclick (simpler)
    shareBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent modal close
      shareQuote(randomQuote.text, randomQuote.author);
    };
  }

  // Show modal after a short delay for better effect
  setTimeout(() => {
    if (quoteModalOverlay) {
      quoteModalOverlay.classList.add('active');
    }
  }, 800);
}

// Close quote modal
function closeQuoteModal() {
  if (quoteModalOverlay) {
    quoteModalOverlay.classList.remove('active');
  }
}

// Event listeners for quote modal
if (quoteModalClose) {
  quoteModalClose.addEventListener('click', closeQuoteModal);
}

if (quoteModalOverlay) {
  quoteModalOverlay.addEventListener('click', (e) => {
    // Close if clicked on overlay, not the modal itself
    if (e.target === quoteModalOverlay) {
      closeQuoteModal();
    }
  });
}

// Initialize app after all functions are defined
initTabs();
init();
showDailyQuote(); // Show random quote on page load

// ============================================
// Qada Prayer Tracking System
// ============================================

const QADA_STORAGE_KEY = 'qadaPrayerData';

// Default data structure
const defaultQadaData = {
  counters: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  dailyGoal: 2,
  today: {
    date: getCurrentDate(),
    completed: 0,
    prayers: []
  },
  history: []
};

// Get current date as YYYY-MM-DD
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Load qada data from localStorage
function loadQadaData() {
  try {
    const stored = localStorage.getItem(QADA_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      resetDailyIfNeeded(data);
      return data;
    }
  } catch (error) {
    console.error('Error loading qada data:', error);
  }
  return { ...defaultQadaData };
}

// Save qada data to localStorage
function saveQadaData(data) {
  try {
    localStorage.setItem(QADA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving qada data:', error);
    alert('Veri kaydedilemedi. Tarayıcı hafızası dolu olabilir.');
  }
}

// Reset daily progress if new day
function resetDailyIfNeeded(data) {
  const today = getCurrentDate();
  if (data.today.date !== today) {
    // Save yesterday's data to history
    if (data.today.completed > 0) {
      data.history.push({
        date: data.today.date,
        completed: data.today.completed,
        prayers: [...data.today.prayers]
      });

      // Keep only last 365 days (1 year)
      if (data.history.length > 365) {
        data.history = data.history.slice(-365);
      }
    }

    // Reset today
    data.today = {
      date: today,
      completed: 0,
      prayers: []
    };

    saveQadaData(data);
  }
}

// Initialize qada system
let qadaData = loadQadaData();

// Increment counter
function incrementQada(prayer) {
  if (qadaData.counters[prayer] < 9999) {
    qadaData.counters[prayer]++;
    saveQadaData(qadaData);
    renderQadaCounters();
  }
}

// Decrement counter
function decrementQada(prayer) {
  if (qadaData.counters[prayer] > 0) {
    qadaData.counters[prayer]--;
    saveQadaData(qadaData);
    renderQadaCounters();
  }
}

// Mark prayer as completed today
function markQadaComplete(prayer) {
  const btn = document.querySelector(`button[onclick="markQadaComplete('${prayer}')"]`);

  // Check if already completed today
  const alreadyCompleted = qadaData.today.prayers.includes(prayer);

  if (alreadyCompleted) {
    // Undo completion
    qadaData.today.prayers = qadaData.today.prayers.filter(p => p !== prayer);
    qadaData.today.completed--;
    qadaData.counters[prayer]++; // Add back to counter
    btn.classList.remove('completed');
  } else {
    // Mark as completed
    if (qadaData.counters[prayer] > 0) {
      qadaData.today.prayers.push(prayer);
      qadaData.today.completed++;
      qadaData.counters[prayer]--; // Reduce counter
      btn.classList.add('completed');
    } else {
      alert('Bu namazın kaza sayısı sıfır!');
      return;
    }
  }

  saveQadaData(qadaData);
  renderQadaCounters();
  renderDailyProgress();
}

// Calculate total qada
function calculateTotalQada() {
  return Object.values(qadaData.counters).reduce((sum, count) => sum + count, 0);
}

// Get last 7 days stats
function getLast7DaysStats() {
  const last7Days = qadaData.history.slice(-7);
  const total = last7Days.reduce((sum, day) => sum + day.completed, 0);
  const average = last7Days.length > 0 ? (total / 7).toFixed(1) : 0;

  // Include today if completed any
  const todayCompleted = qadaData.today.completed;
  const totalWithToday = total + todayCompleted;

  return {
    total: totalWithToday,
    average: ((totalWithToday) / 7).toFixed(1)
  };
}

// Render counters
function renderQadaCounters() {
  // Update individual counters
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  prayers.forEach(prayer => {
    const counterEl = document.getElementById(`counter-${prayer}`);
    if (counterEl) {
      counterEl.textContent = qadaData.counters[prayer];
    }

    // Update complete button state
    const btn = document.querySelector(`button[onclick="markQadaComplete('${prayer}')"]`);
    if (btn) {
      if (qadaData.today.prayers.includes(prayer)) {
        btn.classList.add('completed');
      } else {
        btn.classList.remove('completed');
      }
    }
  });

  // Update total
  const totalEl = document.getElementById('total-qada');
  if (totalEl) {
    totalEl.textContent = calculateTotalQada();
  }

  // Update stats
  const stats = getLast7DaysStats();
  const stat7DaysEl = document.getElementById('stat-7days');
  const statAverageEl = document.getElementById('stat-average');

  if (stat7DaysEl) stat7DaysEl.textContent = stats.total;
  if (statAverageEl) statAverageEl.textContent = stats.average;
}

// Render daily progress
function renderDailyProgress() {
  const progressText = document.getElementById('today-progress-text');
  const progressBar = document.getElementById('today-progress-bar');

  const completed = qadaData.today.completed;
  const goal = qadaData.dailyGoal;
  const percentage = Math.min((completed / goal) * 100, 100);

  if (progressText) {
    progressText.textContent = `${completed}/${goal} kaza kılındı`;
  }

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
}

// Handle daily goal change
const dailyGoalSelect = document.getElementById('daily-goal');
if (dailyGoalSelect) {
  dailyGoalSelect.value = qadaData.dailyGoal;

  dailyGoalSelect.addEventListener('change', (e) => {
    qadaData.dailyGoal = parseInt(e.target.value);
    saveQadaData(qadaData);
    renderDailyProgress();
  });
}

// Export data
const exportBtn = document.getElementById('export-qada-btn');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(qadaData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaza_namazlari_${getCurrentDate()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Yedek dosyası indirildi! ✅');
  });
}

// Import data
const importBtn = document.getElementById('import-qada-btn');
const importFile = document.getElementById('import-qada-file');

if (importBtn && importFile) {
  importBtn.addEventListener('click', () => {
    importFile.click();
  });

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        // Validate data structure
        if (!imported.counters || !imported.dailyGoal) {
          throw new Error('Geçersiz dosya formatı');
        }

        // Confirm import
        if (confirm('Mevcut veriler silinecek ve yedek yüklenecek. Devam edilsin mi?')) {
          qadaData = imported;
          resetDailyIfNeeded(qadaData);
          saveQadaData(qadaData);

          // Update UI
          dailyGoalSelect.value = qadaData.dailyGoal;
          renderQadaCounters();
          renderDailyProgress();

          alert('Yedek başarıyla yüklendi! ✅');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Geçersiz yedek dosyası! ❌');
      }

      // Reset file input
      importFile.value = '';
    };

    reader.readAsText(file);
  });
}

// ============================================
// Button Event Listeners (Fixed for onclick issue)
// ============================================

// Attach event listeners to all counter buttons
document.querySelectorAll('.counter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const prayer = btn.dataset.prayer;
    const action = btn.dataset.action;

    if (action === 'increment') {
      incrementQada(prayer);
    } else if (action === 'decrement') {
      decrementQada(prayer);
    }
  });
});

// Attach event listeners to complete buttons
document.querySelectorAll('.complete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const prayer = btn.dataset.prayer;
    markQadaComplete(prayer);
  });
});

// ============================================
// Advanced Statistics
// ============================================

function getAdvancedStats() {
  const last7Days = qadaData.history.slice(-7);
  const last30Days = qadaData.history.slice(-30);

  const total7Days = last7Days.reduce((sum, day) => sum + day.completed, 0);
  const total30Days = last30Days.reduce((sum, day) => sum + day.completed, 0);

  // Include today
  const todayCompleted = qadaData.today.completed;
  const total7 = total7Days + todayCompleted;
  const total30 = total30Days + todayCompleted;

  // Calculate average
  const average = ((total7) / 7).toFixed(1);

  // Find best day
  const allDays = [...qadaData.history, qadaData.today];
  const bestDay = Math.max(...allDays.map(d => d.completed), 0);

  return {
    total7Days: total7,
    total30Days: total30,
    average,
    bestDay
  };
}

// Update render to include advanced stats
function renderAdvancedStats() {
  const stats = getAdvancedStats();

  const stat7DaysEl = document.getElementById('stat-7days');
  const stat30DaysEl = document.getElementById('stat-30days');
  const statAverageEl = document.getElementById('stat-average');
  const statBestEl = document.getElementById('stat-best');

  if (stat7DaysEl) stat7DaysEl.textContent = stats.total7Days;
  if (stat30DaysEl) stat30DaysEl.textContent = stats.total30Days;
  if (statAverageEl) statAverageEl.textContent = stats.average;
  if (statBestEl) statBestEl.textContent = stats.bestDay;
}

// ============================================
// Chart.js Visualization
// ============================================

let qadaChart = null;

function initChart() {
  const canvas = document.getElementById('qadaChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Get last 30 days data
  const last30Days = qadaData.history.slice(-30);

  // Generate labels and data
  const labels = [];
  const data = [];

  // Fill with  last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Find data for this date
    const dayData = last30Days.find(d => d.date === dateStr);

    // Short label (day number)
    labels.push(date.getDate());
    data.push(dayData ? dayData.completed : 0);
  }

  // Add today
  labels.push('Bugün');
  data.push(qadaData.today.completed);

  // Destroy previous chart if exists
  if (qadaChart) {
    qadaChart.destroy();
  }

  // Create new chart
  qadaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Kılınan Kaza',
        data: data,
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(6, 182, 212)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return context.parsed.y + ' kaza kılındı';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 10
            },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 15
          },
          grid: {
            display: false,
            drawBorder: false
          }
        }
      }
    }
  });
}

// Update renderQadaCounters to also update advanced stats and chart
const originalRenderQadaCounters = renderQadaCounters;
renderQadaCounters = function () {
  // Call original function
  originalRenderQadaCounters();

  // Update advanced stats
  renderAdvancedStats();

  // Update chart
  if (typeof Chart !== 'undefined') {
    initChart();
  }
};

// Initial render
renderQadaCounters();
renderDailyProgress();

// Initialize chart after a short delay
setTimeout(() => {
  if (typeof Chart !== 'undefined') {
    initChart();
  }
}, 100);

// ============================================
// Quote Sharing (Image Generation)
// ============================================

window.shareQuote = async function (text, author) {
  showToast('Görsel hazırlanıyor...');

  // Create a temporary container for rendering
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    width: '1080px',
    height: '1080px',
    background: 'linear-gradient(135deg, #0f5156 0%, #1a7178 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif"
  });

  // Decorative border
  const border = document.createElement('div');
  Object.assign(border.style, {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '30px',
    pointerEvents: 'none'
  });
  container.appendChild(border);

  // Icon
  const icon = document.createElement('div');
  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"></path></svg>';
  icon.style.marginBottom = '60px';
  container.appendChild(icon);

  // Text
  const textEl = document.createElement('h1');
  textEl.textContent = text;
  // Font scaling logic
  const len = text.length;
  textEl.style.fontSize = len > 300 ? '36px' : len > 200 ? '42px' : len > 100 ? '54px' : '64px';
  textEl.style.lineHeight = '1.4';
  textEl.style.textAlign = 'center';
  textEl.style.fontWeight = '500';
  textEl.style.marginBottom = '60px';
  textEl.style.maxWidth = '900px';
  textEl.style.textShadow = '0 4px 10px rgba(0,0,0,0.2)';
  container.appendChild(textEl);

  // Line
  const line = document.createElement('div');
  Object.assign(line.style, {
    width: '120px',
    height: '4px',
    background: '#f59e0b',
    marginBottom: '40px',
    borderRadius: '2px'
  });
  container.appendChild(line);

  // Author
  const authorEl = document.createElement('p');
  authorEl.textContent = author;
  authorEl.style.fontSize = '32px';
  authorEl.style.fontWeight = '300';
  authorEl.style.opacity = '0.9';
  authorEl.style.letterSpacing = '1px';
  container.appendChild(authorEl);

  // Watermark
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    position: 'absolute',
    bottom: '50px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    opacity: '0.7',
    fontSize: '24px'
  });
  footer.innerHTML = '<span style="font-size: 28px;">🕌</span> Namaz Vakti';
  container.appendChild(footer);

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true
    });

    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error('Blob creation failed');

      // Use JPEG for better compatibility and smaller size
      const filename = `hikmetli-soz-${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg', lastModified: Date.now() });

      // Check if Web Share API is fully supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Hikmetli Söz'
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
            showToast('Paylaşım menüsü açılamadı, görsel indiriliyor.');
            setTimeout(() => downloadImage(canvas), 1500);
          }
        }
      } else {
        downloadImage(canvas);
      }

      document.body.removeChild(container);
    }, 'image/jpeg', 0.95);

  } catch (error) {
    console.error('Generation error:', error);
    document.body.removeChild(container);
    // Fallback to clipboard
    navigator.clipboard.writeText(`"${text}" - ${author}`)
      .then(() => showToast('Görsel oluşturulamadı, metin kopyalandı.'))
      .catch(() => showToast('İşlem başarısız.'));
  }
};

function downloadImage(canvas) {
  const link = document.createElement('a');
  link.download = `hikmetli-soz-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Görsel indirildi');
}

window.copyQuote = function (text, author) {
  navigator.clipboard.writeText(`"${text}" - ${author}`)
    .then(() => showToast('Söz kopyalandı'))
    .catch(console.error);
};

window.showToast = function (message) {
  const existing = document.querySelector('.toast-message');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1e293b',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    zIndex: '10000',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

window.shareQuote = async function (text, author) {
  showToast('Görsel hazırlanıyor...');

  // Create a temporary container for rendering
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    width: '1080px',
    height: '1080px',
    background: 'linear-gradient(135deg, #0f5156 0%, #1a7178 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif"
  });

  // Decorative border
  const border = document.createElement('div');
  Object.assign(border.style, {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '30px',
    pointerEvents: 'none'
  });
  container.appendChild(border);

  // Icon
  const icon = document.createElement('div');
  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"></path></svg>';
  icon.style.marginBottom = '60px';
  container.appendChild(icon);

  // Text
  const textEl = document.createElement('h1');
  textEl.textContent = text;
  // Font scaling logic
  const len = text.length;
  textEl.style.fontSize = len > 300 ? '36px' : len > 200 ? '42px' : len > 100 ? '54px' : '64px';
  textEl.style.lineHeight = '1.4';
  textEl.style.textAlign = 'center';
  textEl.style.fontWeight = '500';
  textEl.style.marginBottom = '60px';
  textEl.style.maxWidth = '900px';
  textEl.style.textShadow = '0 4px 10px rgba(0,0,0,0.2)';
  container.appendChild(textEl);

  // Line
  const line = document.createElement('div');
  Object.assign(line.style, {
    width: '120px',
    height: '4px',
    background: '#f59e0b',
    marginBottom: '40px',
    borderRadius: '2px'
  });
  container.appendChild(line);

  // Author
  const authorEl = document.createElement('p');
  authorEl.textContent = author;
  authorEl.style.fontSize = '32px';
  authorEl.style.fontWeight = '300';
  authorEl.style.opacity = '0.9';
  authorEl.style.letterSpacing = '1px';
  container.appendChild(authorEl);

  // Watermark
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    position: 'absolute',
    bottom: '50px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    opacity: '0.7',
    fontSize: '24px'
  });
  footer.innerHTML = '<span style="font-size: 28px;">🕌</span> Namaz Vakti';
  container.appendChild(footer);

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true
    });

    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error('Blob creation failed');

      // Use JPEG for better compatibility and smaller size
      const filename = `hikmetli-soz-${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg', lastModified: Date.now() });

      // Check if Web Share API is fully supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Hikmetli Söz'
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
            showToast('Paylaşım menüsü açılamadı, görsel indiriliyor.');
            setTimeout(() => downloadImage(canvas), 1500);
          }
        }
      } else {
        downloadImage(canvas);
      }

      document.body.removeChild(container);
    }, 'image/jpeg', 0.95);

  } catch (error) {
    console.error('Generation error:', error);
    document.body.removeChild(container);
    // Fallback to clipboard
    navigator.clipboard.writeText(`"${text}" - ${author}`)
      .then(() => showToast('Görsel oluşturulamadı, metin kopyalandı.'))
      .catch(() => showToast('İşlem başarısız.'));
  }
};


canvas.toBlob(async (blob) => {
  if (!blob) throw new Error('Blob creation failed');
  // Use JPEG for better compatibility and smaller size
  const file = new File([blob], 'hikmetli-soz.jpg', { type: 'image/jpeg', lastModified: Date.now() });

  // Check if Web Share API is fully supported
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Hikmetli Söz'
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        // Show toast before downloading to explain
        showToast('Paylaşım menüsü açılamadı, görsel indiriliyor.');
        setTimeout(() => downloadImage(canvas), 1500);
      }
    }
  } else {
    downloadImage(canvas);
  }

  document.body.removeChild(container);
}, 'image/jpeg', 0.95);

  } catch (error) {
  console.error('Generation error:', error);
  document.body.removeChild(container);
  // Fallback to clipboard
  navigator.clipboard.writeText(`"${text}" - ${author}`)
    .then(() => showToast('Görsel oluşturulamadı, metin kopyalandı.'))
    .catch(() => showToast('İşlem başarısız.'));
}
};

canvas.toBlob(async (blob) => {
  if (!blob) throw new Error('Blob creation failed');
  // Use JPEG for better compatibility and smaller size
  const file = new File([blob], 'hikmetli-soz.jpg', { type: 'image/jpeg', lastModified: Date.now() });

  // Check if Web Share API is fully supported
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Hikmetli Söz'
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        // Show toast before downloading to explain
        showToast('Paylaşım menüsü açılamadı, görsel indiriliyor.');
        setTimeout(() => downloadImage(canvas), 1500);
      }
    }
  } else {
    downloadImage(canvas);
  }

  document.body.removeChild(container);
}, 'image/jpeg', 0.95);

  } catch (error) {
  console.error('Generation error:', error);
  document.body.removeChild(container);
  // Fallback to clipboard
  navigator.clipboard.writeText(`"${text}" - ${author}`)
    .then(() => showToast('Görsel oluşturulamadı, metin kopyalandı.'))
    .catch(() => showToast('İşlem başarısız.'));
}
};

canvas.toBlob(async (blob) => {
  if (!blob) throw new Error('Blob creation failed');
  // Use JPEG for better compatibility and smaller size
  const file = new File([blob], 'hikmetli-soz.jpg', { type: 'image/jpeg', lastModified: Date.now() });

  // Check if Web Share API is fully supported
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Hikmetli Söz'
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        // Show toast before downloading to explain
        showToast('Paylaşım menüsü açılamadı, görsel indiriliyor.');
        setTimeout(() => downloadImage(canvas), 1500);
      }
    }
  } else {
    downloadImage(canvas);
  }

  document.body.removeChild(container);
}, 'image/jpeg', 0.95);
  } catch (err) {
  if (err.name !== 'AbortError') {
    downloadImage(canvas);
  }
}
} else {
  downloadImage(canvas);
}

document.body.removeChild(container);
    }, 'image/png');

  } catch (error) {
  console.error('Generation error:', error);
  document.body.removeChild(container);
  // Fallback to clipboard
  navigator.clipboard.writeText(`"${text}" - ${author}`)
    .then(() => showToast('Görsel oluşturulamadı, metin kopyalandı.'))
    .catch(() => showToast('İşlem başarısız.'));
}
};

function downloadImage(canvas) {
  const link = document.createElement('a');
  link.download = `hikmetli-soz-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Görsel indirildi');
}

window.copyQuote = function (text, author) {
  navigator.clipboard.writeText(`"${text}" - ${author}`)
    .then(() => showToast('Söz kopyalandı'))
    .catch(console.error);
};

window.showToast = function (message) {
  const existing = document.querySelector('.toast-message');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1e293b',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    zIndex: '10000',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

