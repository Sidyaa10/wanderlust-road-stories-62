import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api, RoadTrip } from '@/services/api';
import Layout from '@/components/Layout';
import RoadTripCard from '@/components/RoadTripCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import TripDetailPage from './TripDetailPage';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TripComments from '@/components/TripComments';

const BASE_AUTHOR = {
  id: 'sidkadam',
  username: 'sidkadam',
  name: 'Sid Kadam',
  bio: "Web App Developer",
  avatar: "https://avatars.githubusercontent.com/u/4149056?v=4",
  followers: 0,
  following: 0,
  created_at: new Date().toISOString(),
};

export const sampleTrips: RoadTrip[] = [
  {
    id: 'eu1',
    title: "Romantic Road, Germany",
    description: "Explore scenic Bavarian towns, castles, and vineyards along Germany's most picturesque route.",
    image: "https://content.tui.co.uk/adamtui/2021_4/29_13/9c4257d8-a79a-47a6-95ff-ad1900e4f05f/ACC_969884_shutterstock_1454474615WebOriginalCompressed.jpg",
    distance: 350,
    duration: 4,
    location: "Europe - Germany",
    difficulty: "Easy",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'rr1', trip_id: 'eu1', name: 'Würzburg Residence', description: 'Baroque palace and UNESCO World Heritage Site.', image: 'https://www.nomads-travel-guide.com/wp-content/uploads/2023/05/Wurzburg-Residence.jpg', location: 'Würzburg, Germany', position: 1, created_at: new Date().toISOString(), latitude: 49.7961, longitude: 9.9286 },
      { id: 'rr2', trip_id: 'eu1', name: 'Rothenburg ob der Tauber', description: 'Medieval walled town with cobblestone streets.', image: 'https://pohcdn.com/sites/default/files/styles/node__blog_post__bp_banner/public/live_banner/Rothenburg-ob-der-Tauber.jpg', location: 'Rothenburg ob der Tauber, Germany', position: 2, created_at: new Date().toISOString(), latitude: 49.3920, longitude: 10.1820 },
      { id: 'rr3', trip_id: 'eu1', name: 'Dinkelsbühl', description: 'Charming old town with colorful houses.', image: 'https://static.ffx.io/images/$zoom_1%2C$multiply_0.3133%2C$ratio_1.777778%2C$width_1979%2C$x_0%2C$y_192/t_crop_custom/q_86%2Cf_auto/1adeafe74190f27451a331a38887a65da995cccf', location: 'Dinkelsbühl, Germany', position: 3, created_at: new Date().toISOString(), latitude: 48.9226, longitude: 10.3206 },
      { id: 'rr4', trip_id: 'eu1', name: 'Nördlingen', description: 'Town built in a meteorite crater.', image: 'https://www.thirstyswagman.com/wp-content/uploads/2022/12/Noerdlingen-Germany.jpg', location: 'Nördlingen, Germany', position: 4, created_at: new Date().toISOString(), latitude: 48.9700, longitude: 10.4500 },
      { id: 'rr5', trip_id: 'eu1', name: 'Augsburg', description: 'One of Germany\'s oldest cities.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Augsburg_-_Markt.jpg', location: 'Augsburg, Germany', position: 5, created_at: new Date().toISOString(), latitude: 48.3700, longitude: 10.8900 },
      { id: 'rr6', trip_id: 'eu1', name: 'Landsberg am Lech', description: 'Picturesque town on the Lech river.', image: 'https://www.romantischestrasse.de/wp-content/uploads/2024/05/LandsbergHauptplatz-1024x683.jpg', location: 'Landsberg am Lech, Germany', position: 6, created_at: new Date().toISOString(), latitude: 48.0550, longitude: 10.8800 },
      { id: 'rr7', trip_id: 'eu1', name: 'Füssen', description: 'Gateway to the Alps and Romantic Road\'s end.', image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/12/42/0b/ec.jpg', location: 'Füssen, Germany', position: 7, created_at: new Date().toISOString(), latitude: 47.5575, longitude: 10.6667 },
      { id: 'rr8', trip_id: 'eu1', name: 'Neuschwanstein Castle', description: 'Fairytale castle and iconic landmark.', image: 'https://traversewithtaylor.com/wp-content/uploads/2023/02/Untitled-design-2023-02-19T215858.007.jpg', location: 'Schwangau, Germany', position: 8, created_at: new Date().toISOString(), latitude: 47.5575, longitude: 10.6667 },
      { id: 'rr9', trip_id: 'eu1', name: 'Hohenschwangau Castle', description: '19th-century castle near Neuschwanstein.', image: 'https://www.hohenschwangau.de/fileadmin/_processed_/2/9/csm_20180425-DJI_0213-HDR-jan-wischnat_ae12c6efcb.jpg', location: 'Schwangau, Germany', position: 9, created_at: new Date().toISOString(), latitude: 47.5575, longitude: 10.6667 }
    ],
    ratings: []
  },
  {
    id: 'eu2',
    title: "Alpine Wonders: Switzerland",
    description: "Journey through the Swiss Alps visiting Lucerne, Interlaken, and breathtaking mountain passes.",
    image: "https://cdn-v2.theculturetrip.com/1200x675/wp-content/uploads/2024/04/patrick-robert-doyle-r4pxpnsizhw-unsplash-min-e1712853111108.webp",
    distance: 420,
    duration: 5,
    location: "Europe - Switzerland",
    difficulty: "Moderate",
    average_rating: 4.9,
    averageRating: 4.9,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'sw1', trip_id: 'eu2', name: 'Lucerne', description: 'City on the shore of Lake Lucerne.', image: 'https://switzerland-tour.com/storage/media/Lucerne/Lucerne-from-the-top-Switzerland.jpg', location: 'Lucerne, Switzerland', position: 1, created_at: new Date().toISOString(), latitude: 47.0502, longitude: 8.3093 },
      { id: 'sw2', trip_id: 'eu2', name: 'Interlaken', description: 'Town between two lakes in the Bernese Oberland.', image: 'https://cdn.audleytravel.com/1080/771/79/15986030-interlaken.webp', location: 'Interlaken, Switzerland', position: 2, created_at: new Date().toISOString(), latitude: 46.6850, longitude: 7.8687 },
      { id: 'sw3', trip_id: 'eu2', name: 'Eiger', description: 'Massive north face of the Eiger.', image: 'https://www.adventurepeaks.com/site/assets/files/1442/eiger.jpg', location: 'Eiger, Switzerland', position: 3, created_at: new Date().toISOString(), latitude: 46.5923, longitude: 7.9477 },
      { id: 'sw4', trip_id: 'eu2', name: 'Mürren', description: 'Village in the Bernese Oberland.', image: 'https://travel-shark.com/wp-content/uploads/2020/08/MurrenDowntown-1030x640.jpg', location: 'Mürren, Switzerland', position: 4, created_at: new Date().toISOString(), latitude: 46.6250, longitude: 7.8500 },
      { id: 'sw5', trip_id: 'eu2', name: 'Grindelwald', description: 'Village in the Bernese Oberland.', image: 'https://cdn.audleytravel.com/3549/2535/79/15986035-grindelwald.jpg', location: 'Grindelwald, Switzerland', position: 5, created_at: new Date().toISOString(), latitude: 46.6617, longitude: 7.6117 },
      { id: 'sw6', trip_id: 'eu2', name: 'Zermatt', description: 'Village in the canton of Valais.', image: 'https://www.signatureluxurytravel.com.au/wp-content/uploads/2024/05/0.STMS23_Keyvisual_edit_LR.jpg', location: 'Zermatt, Switzerland', position: 6, created_at: new Date().toISOString(), latitude: 46.0080, longitude: 8.5600 },
      { id: 'sw7', trip_id: 'eu2', name: 'St. Moritz', description: 'Village in the canton of Graubünden.', image: 'https://www.kayak.co.in/rimg/himg/1b/8b/3f/leonardo-1130515-Carlton_Hotel_St._Moritz_(8)_O-341893.jpg?width=1366&height=768&crop=true', location: 'St. Moritz, Switzerland', position: 7, created_at: new Date().toISOString(), latitude: 46.4570, longitude: 9.8270 },
      { id: 'sw8', trip_id: 'eu2', name: 'Davos', description: 'Village in the canton of Graubünden.', image: 'https://www.alpengoldhotel.com/wp-content/uploads/2022/08/alpengold_davos_sommer_2.jpg', location: 'Davos, Switzerland', position: 8, created_at: new Date().toISOString(), latitude: 46.7850, longitude: 9.8200 },
      { id: 'sw9', trip_id: 'eu2', name: 'Zug', description: 'City on the shore of Lake Zug.', image: 'https://media.myswitzerland.com/image/fetch/c_lfill,g_auto,w_3200,h_1800/f_auto,q_80,fl_keep_iptc/https://www.myswitzerland.com/-/media/dam/resources/places/z/u/zug/images%20summer/57518_32001800.jpeg', location: 'Zug, Switzerland', position: 9, created_at: new Date().toISOString(), latitude: 47.1700, longitude: 8.5200 },
    ],
    ratings: []
  },
  {
    id: 'eu3',
    title: "Tuscan Sun Drive",
    description: "Sunset drives through rolling vineyards and cypress-lined roads in Tuscany, Italy.",
    image: "https://i.pinimg.com/1200x/7e/bb/e8/7ebbe8c3c27faf246273588e8e7447fa.jpg",
    distance: 190,
    duration: 3,
    location: "Europe - Italy",
    difficulty: "Easy",
    average_rating: 4.7,
    averageRating: 4.7,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'it1', trip_id: 'eu3', name: 'Pisa', description: 'City of the Leaning Tower.', image: 'https://ita.travel/img/t750h0/blogimg/leto/toscana/pisa-uvodni.jpg', location: 'Pisa, Italy', position: 1, created_at: new Date().toISOString(), latitude: 43.7230, longitude: 10.3965 },
      { id: 'it2', trip_id: 'eu3', name: 'Lucca', description: 'City with a medieval wall.', image: 'https://blog.italotreno.com/wp-content/uploads/2022/10/panorama-lucca.jpg', location: 'Lucca, Italy', position: 2, created_at: new Date().toISOString(), latitude: 43.8434, longitude: 10.5052 },
      { id: 'it3', trip_id: 'eu3', name: 'San Gimignano', description: 'Twin-towered medieval hill town.', image: 'https://borgopignano.cdn.imgeng.in/assets/uploads/surroundings/stock-provvisorie/san-gimignano.jpg', location: 'San Gimignano, Italy', position: 3, created_at: new Date().toISOString(), latitude: 43.4998, longitude: 11.0457 },
      { id: 'it4', trip_id: 'eu3', name: 'Siena', description: 'Historic city known for its cuisine, art, and medieval cityscape.', image: 'https://images.winalist.com/blog/wp-content/uploads/2024/07/24170157/AdobeStock_184438229-1-1500x1001.jpeg', location: 'Siena, Italy', position: 4, created_at: new Date().toISOString(), latitude: 43.1167, longitude: 11.3333 },
      { id: 'it5', trip_id: 'eu3', name: 'Florence', description: 'Renaissance city with iconic art and architecture.', image: 'https://cdn-imgix.headout.com/media/images/1300daf8e72cbe5623b8a4d84a398f1f-Duomo%20Florence%20golden%20hour.jpg', location: 'Florence, Italy', position: 5, created_at: new Date().toISOString(), latitude: 43.7696, longitude: 11.2558 },
      { id: 'it6', trip_id: 'eu3', name: 'Arezzo', description: 'City in eastern Tuscany.', image: 'https://pohcdn.com/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/Arezzo.jpg', location: 'Arezzo, Italy', position: 6, created_at: new Date().toISOString(), latitude: 43.4500, longitude: 11.8833 },
      { id: 'it7', trip_id: 'eu3', name: 'Cortona', description: 'Hilltop town with Etruscan roots.', image: 'https://www.to-tuscany.com/cmsdata/db/images/infopages/content/c/ttd.jpg', location: 'Cortona, Italy', position: 7, created_at: new Date().toISOString(), latitude: 43.4000, longitude: 11.8833 },
      { id: 'it8', trip_id: 'eu3', name: 'Montepulciano', description: 'Medieval town known for wine.', image: 'https://images.musement.com/cover/0165/87/adobestock-443988621-jpeg_header-16486659.jpg', location: 'Montepulciano, Italy', position: 8, created_at: new Date().toISOString(), latitude: 42.8667, longitude: 11.8833 },
      { id: 'it9', trip_id: 'eu3', name: 'Montalcino', description: 'Town famous for Brunello wine.', image: 'https://www.explore.com/img/gallery/the-breathtaking-hilltop-fairytale-town-in-italy-is-world-famous-for-its-unmatched-wine-scene/intro-1732863471.jpg', location: 'Montalcino, Italy', position: 9, created_at: new Date().toISOString(), latitude: 43.0500, longitude: 11.7667 }
    ],
    ratings: []
  },
  {
    id: 'ap1',
    title: "Hokkaido Snow Route",
    description: "Drive through snow tunnels and hot springs across Japan's northernmost island.",
    image: "https://www.jtbtravel.com.au/wp-content/uploads/2020/07/2-2-1024x683.jpg",
    distance: 320,
    duration: 4,
    location: "Asia-Pacific - Japan",
    difficulty: "Moderate",
    average_rating: 4.6,
    averageRating: 4.6,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'jp1', trip_id: 'ap1', name: 'Sapporo', description: 'City in the Hokkaido Prefecture.', image: 'https://i.ytimg.com/vi/zF4HqZCODTg/maxresdefault.jpg', location: 'Sapporo, Japan', position: 1, created_at: new Date().toISOString(), latitude: 43.0618, longitude: 141.3544 },
      { id: 'jp2', trip_id: 'ap1', name: 'Otaru', description: 'City on the Otaru Canal.', image: 'https://gaijinpot.scdn3.secure.raxcdn.com/app/uploads/sites/6/2024/08/pixta_113953610_M.jpg', location: 'Otaru, Japan', position: 2, created_at: new Date().toISOString(), latitude: 43.1803, longitude: 140.5500 },
      { id: 'jp3', trip_id: 'ap1', name: 'Noboribetsu', description: 'Hot spring resort town.', image: 'https://travel.rakuten.com/contents/sites/contents/files/styles/max_1300x1300/public/2023-12/noboribetsu-onsen-guide_7.jpg?itok=e9UZjG12', location: 'Noboribetsu, Japan', position: 3, created_at: new Date().toISOString(), latitude: 37.4562, longitude: 139.0350 },
      { id: 'jp4', trip_id: 'ap1', name: 'Lake Toya', description: 'Lake in the Daisetsuzan National Park.', image: 'https://toya-colors.com/en/wp-content/themes/toyacolors/images/craterlake/mv.jpg', location: 'Lake Toya, Japan', position: 4, created_at: new Date().toISOString(), latitude: 42.7402, longitude: 140.3647 },
      { id: 'jp5', trip_id: 'ap1', name: 'Asahikawa', description: 'City in central Hokkaido.', image: 'https://static.gltjp.com/glt/data/article/21000/20234/20240101_015454_85358d87_w1920.webp', location: 'Asahikawa, Japan', position: 5, created_at: new Date().toISOString(), latitude: 43.7696, longitude: 142.3647 },
      { id: 'jp6', trip_id: 'ap1', name: 'Furano', description: 'Town known for lavender fields.', image: 'https://content.api.news/v3/images/bin/09fdff64215f246321ad560b464f12c8', location: 'Furano, Japan', position: 6, created_at: new Date().toISOString(), latitude: 43.3200, longitude: 142.0000 },
      { id: 'jp7', trip_id: 'ap1', name: 'Biei', description: 'Town with rolling hills and flower fields.', image: 'https://i0.wp.com/donnykimball.com/wp-content/uploads/2023/08/The-Flower-Fields-of-Furano-Biei.webp?fit=800%2C530&ssl=1', location: 'Biei, Japan', position: 7, created_at: new Date().toISOString(), latitude: 43.3200, longitude: 142.0000 },
      { id: 'jp8', trip_id: 'ap1', name: 'Abashiri', description: 'Coastal city known for drift ice.', image: 'https://resources.matcha-jp.com/resize/480x2000/2025/02/05-222700.webp', location: 'Abashiri, Japan', position: 8, created_at: new Date().toISOString(), latitude: 44.0000, longitude: 144.0000 },
      { id: 'jp9', trip_id: 'ap1', name: 'Hakodate', description: 'Port city in southern Hokkaido.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Hakodate_Goryokaku_Panorama_1.JPG', location: 'Hakodate, Japan', position: 9, created_at: new Date().toISOString(), latitude: 41.7950, longitude: 140.7425 }
    ],
    ratings: []
  },
  {
    id: 'ap2',
    title: "Great Ocean Road Expedition",
    description: "Drive along Australia's southeastern coast to see the Twelve Apostles and other natural wonders.",
    image: "https://www.discover-the-world.com/app/uploads/2024/09/australia-victoria-great-ocean-road-twelve-apostles-aerial-view-adsk-1.jpg",
    distance: 243,
    duration: 3,
    location: "Asia-Pacific - Australia",
    difficulty: "Easy",
    average_rating: 4.7,
    averageRating: 4.7,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'au1', trip_id: 'ap2', name: 'Sydney', description: 'City in the state of New South Wales.', image: 'https://assets.atdw-online.com.au/images/082abec166a817adfae646daff53ad70.jpeg?rect=0%2C0%2C2048%2C1536&w=2048&h=1536&rot=360&q=eyJ0eXBlIjoibGlzdGluZyIsImxpc3RpbmdJZCI6IjU2YjIzYzkyZDVmMTU2NTA0NWQ4MTBkMiIsImRpc3RyaWJ1dG9ySWQiOiI1NmIxZWI5MzQ0ZmVjYTNkZjJlMzIwYzgiLCJhcGlrZXlJZCI6IjU2YjFlZTU5MGNmMjEzYWQyMGRjNTgxOSJ9', location: 'Sydney, Australia', position: 1, created_at: new Date().toISOString(), latitude: -33.8688, longitude: 151.2153 },
      { id: 'au2', trip_id: 'ap2', name: 'Cape Otway', description: 'Cape at the southern tip of mainland Australia.', image: 'https://www.qantas.com/content/travelinsider/en/explore/australia/victoria/great-ocean-road/step-back-in-time-at-cape-otway-lightstation/jcr:content/parsysTop/hero.img.full.medium.jpg/1532405384171.jpg', location: 'Cape Otway, Australia', position: 2, created_at: new Date().toISOString(), latitude: -38.7900, longitude: 143.0600 },
      { id: 'au3', trip_id: 'ap2', name: 'Twelve Apostles', description: 'Rock formations along the Great Ocean Road.', image: 'https://images.squarespace-cdn.com/content/v1/56132f2fe4b066e7c9ec4efb/1472893308960-Y40C9T8JUNAYY2JZMILG/image-asset.jpeg', location: 'Great Ocean Road, Australia', position: 3, created_at: new Date().toISOString(), latitude: -35.1172, longitude: 147.0625 },
      { id: 'au4', trip_id: 'ap2', name: 'Lorne', description: 'Seaside town on the Great Ocean Road.', image: 'https://i.ytimg.com/vi/QhTPwTPiyzQ/maxresdefault.jpg', location: 'Lorne, Australia', position: 4, created_at: new Date().toISOString(), latitude: -38.6500, longitude: 143.5500 },
      { id: 'au5', trip_id: 'ap2', name: 'Apollo Bay', description: 'Coastal town with beautiful beaches.', image: 'https://visitgreatoceanroad.org.au/wp-content/uploads/2024/12/Apollo-Bay-Beach-1-large.jpg', location: 'Apollo Bay, Australia', position: 5, created_at: new Date().toISOString(), latitude: -38.7500, longitude: 143.7333 },
      { id: 'au6', trip_id: 'ap2', name: 'Port Campbell', description: 'Town near the Twelve Apostles.', image: 'https://wikiaustralia.com/wp-content/uploads/2011/07/shutterstock_1972704503.jpg', location: 'Port Campbell, Australia', position: 6, created_at: new Date().toISOString(), latitude: -38.1500, longitude: 143.1667 },
      { id: 'au7', trip_id: 'ap2', name: 'Warrnambool', description: 'Coastal city at the end of the Great Ocean Road.', image: 'https://i0.wp.com/www.australiangeographic.com.au/wp-content/uploads/2022/11/shutterstock_1388272904-scaled.jpg?fit=900%2C496&ssl=1', location: 'Warrnambool, Australia', position: 7, created_at: new Date().toISOString(), latitude: -38.3800, longitude: 142.4000 },
      { id: 'au8', trip_id: 'ap2', name: 'Torquay', description: 'Surfing capital of Australia.', image: 'https://i2-prod.mirror.co.uk/article32855960.ece/ALTERNATES/s1200d/0_Panorama-of-Torquay-Harbour-and-Town.jpg', location: 'Torquay, Australia', position: 8, created_at: new Date().toISOString(), latitude: -38.3300, longitude: 144.3300 },
      { id: 'au9', trip_id: 'ap2', name: 'Geelong', description: 'Port city southwest of Melbourne.', image: 'https://www.deakin.edu.au/__data/assets/image/0008/2595932/DJI_0056_Geelong_950x475.jpg', location: 'Geelong, Australia', position: 9, created_at: new Date().toISOString(), latitude: -38.1400, longitude: 144.3600 }
    ],
    ratings: []
  },
  {
    id: 'ap3',
    title: "South Island Scenic Loop",
    description: "Mountains, lakes, and fiords await on this epic New Zealand drive.",
    image: "https://seethesouthisland.com/wp-content/uploads/2018/11/drive-to-mount-cook-national-park-new-zealand.jpg",
    distance: 820,
    duration: 7,
    location: "Asia-Pacific - New Zealand",
    difficulty: "Moderate",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'nz1', trip_id: 'ap3', name: 'Queenstown', description: 'City in the Otago region.', image: 'https://content.r9cdn.net/rimg/dimg/54/8c/a3fbfeb7-city-8584-154cabb94ec.jpg?width=1366&height=768&xhint=1144&yhint=1316&crop=true', location: 'Queenstown, New Zealand', position: 1, created_at: new Date().toISOString(), latitude: -45.0312, longitude: 168.6625 },
      { id: 'nz2', trip_id: 'ap3', name: 'Milford Sound', description: 'Deep fiord in the Fiordland National Park.', image: 'https://i0.wp.com/astraylife.com/wp-content/uploads/2022/03/IMG_8394-copy.jpg', location: 'Milford Sound, New Zealand', position: 2, created_at: new Date().toISOString(), latitude: -44.6575, longitude: 167.9150 },
      { id: 'nz3', trip_id: 'ap3', name: 'Doubtful Sound', description: 'Deep fiord in the Fiordland National Park.', image: 'https://www.aatkings.com/media/zy5nbwwf/south-nz-sights-doubtful-sound-banner.jpg', location: 'Doubtful Sound, New Zealand', position: 3, created_at: new Date().toISOString(), latitude: -45.7500, longitude: 167.4167 },
      { id: 'nz4', trip_id: 'ap3', name: 'Te Anau', description: 'Town in the Southland region.', image: 'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_330,q_65,w_639/v1/crm/southlandnz/Te-Anau-Wharf_695f1552-d4e3-285f-f12f3003aa43ce18.jpg', location: 'Te Anau, New Zealand', position: 4, created_at: new Date().toISOString(), latitude: -45.4167, longitude: 167.7167 },
      { id: 'nz5', trip_id: 'ap3', name: 'Fiordland National Park', description: 'National park in the Southland region.', image: 'https://assets3.thrillist.com/v1/image/3138443/1200x630/flatten;crop_down;webp=auto;jpeg_quality=70', location: 'Fiordland National Park, New Zealand', position: 5, created_at: new Date().toISOString(), latitude: -45.7167, longitude: 167.4167 },
      { id: 'nz6', trip_id: 'ap3', name: 'Mount Cook', description: 'Highest peak in New Zealand.', image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/12/78/e6/bb.jpg', location: 'Mount Cook, New Zealand', position: 6, created_at: new Date().toISOString(), latitude: -43.5322, longitude: 170.1344 },
      { id: 'nz7', trip_id: 'ap3', name: 'Lake Pukaki', description: 'Lake in the Mackenzie region.', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/22/36/d7/enjoying-the-calmness.jpg?w=900&h=500&s=1', location: 'Lake Pukaki, New Zealand', position: 7, created_at: new Date().toISOString(), latitude: -44.2333, longitude: 170.1000 },
      { id: 'nz8', trip_id: 'ap3', name: 'Wanaka', description: 'Town on Lake Wanaka.', image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/02/45/94.jpg', location: 'Wanaka, New Zealand', position: 8, created_at: new Date().toISOString(), latitude: -44.3000, longitude: 169.2167 },
      { id: 'nz9', trip_id: 'ap3', name: 'Franz Josef Glacier', description: 'Glacier on the West Coast.', image: 'https://cdn.kimkim.com/files/a/images/4b2df2a8f0f8e495e9f325689ed49faf4f24b558/big-9c25312b17bc8f040004dd8388491c67.jpg', location: 'Franz Josef, New Zealand', position: 9, created_at: new Date().toISOString(), latitude: -43.3000, longitude: 170.1333 }
    ],
    ratings: []
  },
  {
    id: 'am1',
    title: "Pacific Coast Highway Adventure",
    description: "Experience the breathtaking beauty of California's coastline on this iconic road trip from San Francisco to Los Angeles.",
    image: "https://artfulliving.com/wp-content/uploads/2024/07/WEBSITE-ARTICLE-FEATURE-IMAGE-980-%C3%97-653-px-95.png",
    distance: 750,
    duration: 5,
    location: "Americas - California, USA",
    difficulty: "Moderate",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'pch1', trip_id: 'am1', name: 'Santa Monica Pier', description: 'Iconic pier with amusement park, restaurants, and beautiful ocean views.', image: 'https://jernejletica.com/wp-content/uploads/2023/05/Photos-of-Santa-Monica-Pier.jpg', location: 'Santa Monica, CA', position: 1, created_at: new Date().toISOString(), latitude: 34.0106, longitude: -118.4962 },
      { id: 'pch2', trip_id: 'am1', name: 'El Matador State Beach', description: 'Dramatic cliffs, sea caves, and rock formations make this Malibu beach a must-see.', image: 'https://images.squarespace-cdn.com/content/v1/5a5986b2cf81e095e172ce87/1605992546942-RU2CY7PR7XXEOSVISZD1/flyingdawnmarie-el-matador-beach-malibu-02.jpg', location: 'Malibu, CA', position: 2, created_at: new Date().toISOString(), latitude: 34.0259, longitude: -118.6726 },
      { id: 'pch3', trip_id: 'am1', name: 'Santa Barbara', description: 'Charming coastal city with Spanish architecture, beaches, and a vibrant downtown.', image: 'https://assets.milestoneinternet.com/cdn-cgi/image/f=auto/santa-barbara-hotel-collection/sbhotels/insidepage-masthead/sbhotels-experience-santa-barbara-interactive-map-hero.jpg?width=1240&height=550', location: 'Santa Barbara, CA', position: 3, created_at: new Date().toISOString(), latitude: 34.4209, longitude: -119.6986 },
      { id: 'pch4', trip_id: 'am1', name: 'Pismo Beach', description: 'Classic California beach town known for its pier, surf, and clam chowder.', image: 'https://www.pismobeach.org/ImageRepository/Document?documentID=53752', location: 'Pismo Beach, CA', position: 4, created_at: new Date().toISOString(), latitude: 35.1427, longitude: -120.6425 },
      { id: 'pch5', trip_id: 'am1', name: 'Morro Rock (Morro Bay)', description: 'A massive volcanic plug rising from the ocean, a symbol of Morro Bay.', image: 'https://www.morrobayca.gov/ImageRepository/Document?documentID=9062', location: 'Morro Bay, CA', position: 5, created_at: new Date().toISOString(), latitude: 34.3200, longitude: -120.8500 },
      { id: 'pch6', trip_id: 'am1', name: 'Hearst Castle', description: 'Historic hilltop mansion with art, gardens, and stunning views.', image: 'https://www.photopilot.com/media/images/Hearst-Castle_MG_0688.2e16d0ba.fill-1370x800.jpg', location: 'San Simeon, CA', position: 6, created_at: new Date().toISOString(), latitude: 35.6400, longitude: -121.1500 },
      { id: 'pch7', trip_id: 'am1', name: 'McWay Falls (Big Sur)', description: 'A stunning 80-foot waterfall that drops onto the beach in Julia Pfeiffer Burns State Park.', image: 'https://preview.redd.it/the-always-beautiful-mcway-falls-in-big-sur-ca-1200x800-v0-9hpwrfcquxm91.jpg?width=1080&crop=smart&auto=webp&s=add8c9b4e1d0d8a5320ecfff344e052d9c58daf2', location: 'Big Sur, CA', position: 7, created_at: new Date().toISOString(), latitude: 36.4621, longitude: -121.9250 },
      { id: 'pch8', trip_id: 'am1', name: 'Bixby Creek Bridge', description: 'One of the most photographed bridges in California, offering breathtaking views.', image: 'https://drupal-prod.visitcalifornia.com/sites/default/files/styles/opengraph_1200x630/public/VCW_D_Bigsur_T3_Hero_Central%20Coast_Hero_BixbyBridgeBIg%20Sur_VCL_CC_BigSur_BixbyBridge_.jpgFarnum%20copy-1280x642.jpg.webp?itok=ov_HJOUi', location: 'Big Sur, CA', position: 8, created_at: new Date().toISOString(), latitude: 36.4621, longitude: -121.9250 },
      { id: 'pch9', trip_id: 'am1', name: 'Golden Gate Bridge', description: 'World-famous suspension bridge and symbol of San Francisco.', image: 'https://res.cloudinary.com/aenetworks/image/upload/c_fill,w_1200,h_630,g_auto/dpr_auto/f_auto/q_auto:eco/v1/topic-golden-gate-bridge-gettyimages-177770941?_a=BAVAZGDX0', location: 'San Francisco, CA', position: 9, created_at: new Date().toISOString(), latitude: 37.8199, longitude: -122.4783 }
    ],
    ratings: []
  },
  {
    id: 'am2',
    title: "Route 66 Classic",
    description: "Drive from Chicago to Santa Monica on America's most legendary route.",
    image: "https://images.pexels.com/photos/28637778/pexels-photo-28637778/free-photo-of-classic-cars-at-retro-route-66-diner.jpeg",
    distance: 3940,
    duration: 14,
    location: "Americas - USA",
    difficulty: "Moderate",
    average_rating: 4.7,
    averageRating: 4.7,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'us1', trip_id: 'am2', name: 'Chicago', description: 'City in the state of Illinois.', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/df/65/c1/caption.jpg?w=1200&h=-1&s=1', location: 'Chicago, Illinois', position: 1, created_at: new Date().toISOString(), latitude: 41.8781, longitude: -87.6298 },
      { id: 'us2', trip_id: 'am2', name: 'St. Louis', description: 'City in the state of Missouri.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/St_Louis_night_expblend.jpg/1200px-St_Louis_night_expblend.jpg', location: 'St. Louis, Missouri', position: 2, created_at: new Date().toISOString(), latitude: 38.6270, longitude: -90.1994 },
      { id: 'us3', trip_id: 'am2', name: 'Oklahoma City', description: 'City in the state of Oklahoma.', image: 'https://res.cloudinary.com/simpleview/image/upload/v1694724428/clients/oklahoma/DJI_0038_Enhanced_NR_9828fabc-3956-4192-b353-a1bbf8313248.jpg', location: 'Oklahoma City, Oklahoma', position: 3, created_at: new Date().toISOString(), latitude: 35.2219, longitude: -97.5164 },
      { id: 'us4', trip_id: 'am2', name: 'Amarillo', description: 'City in the state of Texas.', image: 'https://www.worldatlas.com/upload/c7/f4/f3/shutterstock-1830464870.jpg', location: 'Amarillo, Texas', position: 4, created_at: new Date().toISOString(), latitude: 35.2219, longitude: -101.8313 },
      { id: 'us5', trip_id: 'am2', name: 'Santa Fe', description: 'City in the state of New Mexico.', image: 'https://lp-cms-production.imgix.net/2025-01/Shutterstock1481021483.jpg?auto=format,compress&q=72&w=1440&h=810&fit=crop', location: 'Santa Fe, New Mexico', position: 5, created_at: new Date().toISOString(), latitude: 35.6869, longitude: -105.9378 },
      { id: 'us6', trip_id: 'am2', name: 'Albuquerque', description: 'City in the state of New Mexico.', image: 'https://www.cubesmart.com/blog/wp-content/uploads/2024/08/1200X630_albuquerque_Blog04-01.jpg', location: 'Albuquerque, New Mexico', position: 6, created_at: new Date().toISOString(), latitude: 35.0844, longitude: -106.6504 },
      { id: 'us7', trip_id: 'am2', name: 'Flagstaff', description: 'City in the state of Arizona.', image: 'https://www.flagstaff.com/images/content/lavpFW1w.jpg', location: 'Flagstaff, Arizona', position: 7, created_at: new Date().toISOString(), latitude: 35.1983, longitude: -111.6513 },
      { id: 'us8', trip_id: 'am2', name: 'Grand Canyon', description: 'Natural wonder in the state of Arizona.', image: 'https://cdn.trailfinders.com/prueu0mbam_shutterstock_156425756_1500x1500.jpg', location: 'Grand Canyon, Arizona', position: 8, created_at: new Date().toISOString(), latitude: 36.1069, longitude: -112.1129 },
      { id: 'us9', trip_id: 'am2', name: 'Santa Monica', description: 'City in the state of California.', image: 'https://drupal-prod.visitcalifornia.com/sites/default/files/styles/fluid_1920/public/2025-01/VC_Santa-Monica-City-Page_gty-957619964-RF_1280x640.jpg.webp?itok=FQBK6sHX', location: 'Santa Monica, California', position: 9, created_at: new Date().toISOString(), latitude: 34.0195, longitude: -118.4912 }
    ],
    ratings: []
  },
  {
    id: 'am3',
    title: "Canadian Rockies Loop",
    description: "Alpine lakes, lush forests, and snowy peaks in Alberta, Canada.",
    image: "https://wildlandtrekking.com/content/webp-express/webp-images/doc-root/content/uploads/2020/03/image1-33.jpg.webp",
    distance: 900,
    duration: 8,
    location: "Americas - Canada",
    difficulty: "Easy",
    average_rating: 4.8,
    averageRating: 4.8,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'ca1', trip_id: 'am3', name: 'Banff', description: 'National park in the province of Alberta.', image: 'https://www.banff-springs-hotel.com/content/uploads/2024/05/BanffSprings_2021_WinterSummer_Selects.00_19_07_02.Still026-scaled.jpg', location: 'Banff, Alberta', position: 1, created_at: new Date().toISOString(), latitude: 51.1784, longitude: -115.5705 },
      { id: 'ca2', trip_id: 'am3', name: 'Lake Louise', description: 'Lake in the Canadian Rockies.', image: 'https://www.skilouise.com/wp-content/uploads/2024/07/1200-chateau-lake-louise-24-1.jpg', location: 'Lake Louise, Alberta', position: 2, created_at: new Date().toISOString(), latitude: 51.4239, longitude: -116.1891 },
      { id: 'ca3', trip_id: 'am3', name: 'Jasper', description: 'National park in the province of Alberta.', image: 'https://d3d0lqu00lnqvz.cloudfront.net/media/media/c315e3ee-1e50-4979-8262-d18cb2844c6e.jpg', location: 'Jasper, Alberta', position: 3, created_at: new Date().toISOString(), latitude: 53.0000, longitude: -116.5167 },
      { id: 'ca4', trip_id: 'am3', name: 'Columbia Icefield', description: 'Icefield in the Canadian Rockies.', image: 'https://b1367470.smushcdn.com/1367470/wp-content/uploads/2023/06/DSC08233-1440x960.jpg?lossy=1&strip=1&webp=1', location: 'Columbia Icefield, Alberta', position: 4, created_at: new Date().toISOString(), latitude: 51.1200, longitude: -116.3000 },
      { id: 'ca5', trip_id: 'am3', name: 'Lake Agnes Tea House', description: 'Tea house in the Canadian Rockies.', image: 'https://banfflakelouise.bynder.com/m/182bcb920ef82ae6/2000x1080_jpg-2021_LakeLouise_Hiking_ROAMCreative-12.jpg', location: 'Lake Agnes Tea House, Alberta', position: 5, created_at: new Date().toISOString(), latitude: 51.4239, longitude: -116.1891 },
      { id: 'ca6', trip_id: 'am3', name: 'Moraine Lake', description: 'Lake in the Canadian Rockies.', image: 'https://www.travelbanffcanada.com/wp-content/uploads/2023/06/Seeing-Moraine-Lake-at-Sunrise-with-Kids-1024x683.jpg', location: 'Moraine Lake, Alberta', position: 6, created_at: new Date().toISOString(), latitude: 51.4239, longitude: -116.1891 },
      { id: 'ca7', trip_id: 'am3', name: 'Athabasca Falls', description: 'Falls in the Canadian Rockies.', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/dc/cf/35/jasper-np.jpg?w=900&h=500&s=1', location: 'Athabasca Falls, Alberta', position: 7, created_at: new Date().toISOString(), latitude: 54.7083, longitude: -116.5000 },
      { id: 'ca8', trip_id: 'am3', name: 'Lake Minnewanka', description: 'Lake in the Canadian Rockies.', image: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/515000/515537-lake-minnewanka.jpg', location: 'Lake Minnewanka, Alberta', position: 8, created_at: new Date().toISOString(), latitude: 51.4239, longitude: -116.1891 },
      { id: 'ca9', trip_id: 'am3', name: 'Peyto Lake', description: 'Glacier-fed lake in Banff National Park.', image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Peyto_Lake_June_2018.jpg', location: 'Peyto Lake, Alberta', position: 9, created_at: new Date().toISOString(), latitude: 51.4239, longitude: -116.1891 }
    ],
    ratings: []
  },
  {
    id: 'ap4',
    title: "Northern Thailand Road Loop",
    description: "Winding roads, lush mountains, and unique culture from Chiang Mai through Pai and Mae Hong Son.",
    image: "https://i1.wp.com/megankaptein.com/wp-content/uploads/2020/06/Mae_Hong_Son_Loop_Road2.jpg?resize=900%2C500&ssl=1",
    distance: 600,
    duration: 6,
    location: "Asia-Pacific - Thailand",
    difficulty: "Moderate",
    average_rating: 4.5,
    averageRating: 4.5,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'th1', trip_id: 'ap4', name: 'Chiang Mai', description: 'City in the northern region of Thailand.', image: 'https://www.cuddlynest.com/blog/wp-content/uploads/2022/07/bangkok-to-chiang-mai-scaled.jpg', location: 'Chiang Mai, Thailand', position: 1, created_at: new Date().toISOString(), latitude: 18.7900, longitude: 98.9600 },
      { id: 'th2', trip_id: 'ap4', name: 'Pai', description: 'Town in the Mae Hong Son province.', image: 'https://asiapioneertravel.com/wp-content/uploads/2017/10/pai-thailand-travel-guide-870x496.jpg', location: 'Pai, Thailand', position: 2, created_at: new Date().toISOString(), latitude: 18.4167, longitude: 99.0167 },
      { id: 'th3', trip_id: 'ap4', name: 'Mae Hong Son', description: 'Town in the Mae Hong Son province.', image: 'https://blog.bangkokair.com/wp-content/uploads/2019/01/Article-1-feat-image.jpg', location: 'Mae Hong Son, Thailand', position: 3, created_at: new Date().toISOString(), latitude: 16.7000, longitude: 98.5500 },
      { id: 'th4', trip_id: 'ap4', name: 'Chiang Rai', description: 'City in the northern region of Thailand.', image: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/475000/475582-Wat-Rong-Khun.jpg', location: 'Chiang Rai, Thailand', position: 4, created_at: new Date().toISOString(), latitude: 19.9000, longitude: 99.8333 },
      { id: 'th5', trip_id: 'ap4', name: 'Golden Triangle', description: 'Region in northern Thailand.', image: 'https://i.ytimg.com/vi/uxrV7s5rL70/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCNs71FSWV3gbH6O5JEsfgSHfxikw', location: 'Golden Triangle, Thailand', position: 5, created_at: new Date().toISOString(), latitude: 15.1500, longitude: 95.9500 },
      { id: 'th6', trip_id: 'ap4', name: 'Chiang Dao', description: 'Mountain range in northern Thailand.', image: 'https://theetstory.blog/wp-content/uploads/2022/12/chiangdaocave.jpg', location: 'Chiang Dao, Thailand', position: 6, created_at: new Date().toISOString(), latitude: 19.3000, longitude: 99.5000 },
      { id: 'th7', trip_id: 'ap4', name: 'Mae Sariang', description: 'Town in Mae Hong Son province.', image: 'https://www.maehongsonholidays.com/wp-content/uploads/2023/05/Mae-Sariang_27_05_2023.webp', location: 'Mae Sariang, Thailand', position: 7, created_at: new Date().toISOString(), latitude: 16.7000, longitude: 98.5500 },
      { id: 'th8', trip_id: 'ap4', name: 'Doi Inthanon', description: 'Highest mountain in Thailand.', image: 'https://www.thainationalparks.com/img/package/2020/08/31/397017/two-chedis-w-900.jpg', location: 'Doi Inthanon, Thailand', position: 8, created_at: new Date().toISOString(), latitude: 18.7833, longitude: 98.9500 },
      { id: 'th9', trip_id: 'ap4', name: 'Mae Sai', description: 'Northernmost district of Thailand.', image: 'https://www.asiakingtravel.com/cuploads/files/488cef9a-city-66961-17250abb2e5-(1).jpg', location: 'Mae Sai, Thailand', position: 9, created_at: new Date().toISOString(), latitude: 16.7000, longitude: 98.5500 }
    ],
    ratings: []
  },
  {
    id: 'am4',
    title: "Monument Valley Dream",
    description: "Experience the dramatic red sandstone formations in the American Southwest.",
    image: "https://wallpaperaccess.com/full/1566122.jpg",
    distance: 80,
    duration: 2,
    location: "Americas - USA",
    difficulty: "Easy",
    average_rating: 4.9,
    averageRating: 4.9,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    author: { ...BASE_AUTHOR },
    stops: [
      { id: 'us1', trip_id: 'am4', name: 'Monument Valley', description: 'Natural wonder in the American Southwest.', image: 'https://gouldings.com/wp-content/uploads/2019/11/Monument-Valley-for-First-Time-Visitors-1.jpg', location: 'Monument Valley, Arizona', position: 1, created_at: new Date().toISOString(), latitude: 36.9286, longitude: -116.0858 },
      { id: 'us2', trip_id: 'am4', name: 'Glen Canyon', description: 'Reservoir in the Glen Canyon National Recreation Area.', image: 'https://d2exd72xrrp1s7.cloudfront.net/www/guide/3388139/1S2yy0?width=3840&crop=false&q=60', location: 'Glen Canyon, Arizona', position: 2, created_at: new Date().toISOString(), latitude: 36.9286, longitude: -116.0858 },
      { id: 'us3', trip_id: 'am4', name: 'Antelope Canyon', description: 'Famous slot canyon near Page.', image: 'https://detoursamericanwest.com/wp-content/uploads/2023/03/Antelope-Canyon-Tours-from-Phoenix-DETOURS-LP.jpg', location: 'Antelope Canyon, Arizona', position: 3, created_at: new Date().toISOString(), latitude: 36.9286, longitude: -116.0858 },
      { id: 'us4', trip_id: 'am4', name: 'Horseshoe Bend', description: 'Meander in the Colorado River.', image: 'https://pagelakepowellhub.com/wp-content/uploads/2023/02/HorseshoeBEndSM.webp', location: 'Horseshoe Bend, Arizona', position: 4, created_at: new Date().toISOString(), latitude: 36.9286, longitude: -116.0858 },
      { id: 'us5', trip_id: 'am4', name: 'Valley of the Gods', description: 'Scenic sandstone valley.', image: 'https://lh5.googleusercontent.com/DDJYTVz_ElQ6VmuBF7_UAwi7Uvze4USK5VrBa8TULRXmEL1CaloC3GfiHb5fhQAAzVc0OVgYp6SMOZPD0uiUIVoj_X9uqjtSG39DPo1WoqNarXiH6Lc6kHVw9Xz4lvobtWDn40TT', location: 'Valley of the Gods, Utah', position: 5, created_at: new Date().toISOString(), latitude: 37.2000, longitude: -113.0000 },
      { id: 'us6', trip_id: 'am4', name: 'Goosenecks State Park', description: 'State park with river meanders.', image: 'https://images.ctfassets.net/0wjmk6wgfops/4tixTfzsmn5ifx8dcposn6/632c7474ba48a55d4f76219b04e953b2/AdobeStock_111182488.jpeg?w=1280&h=800&fit=fill&f=center&q=80', location: 'Goosenecks State Park, Utah', position: 6, created_at: new Date().toISOString(), latitude: 37.2000, longitude: -113.0000 },
      { id: 'us7', trip_id: 'am4', name: 'Mexican Hat', description: 'Small town named after a rock formation.', image: 'https://www.insideelsewhere.com/wp-content/uploads/2023/08/Mexican-Hat-Utah-A-Journey-To-The-Stone-Sombrero.jpg', location: 'Mexican Hat, Utah', position: 7, created_at: new Date().toISOString(), latitude: 37.2000, longitude: -113.0000 },
      { id: 'us8', trip_id: 'am4', name: 'Navajo National Monument', description: 'Preserves cliff dwellings of the Ancestral Puebloans.', image: 'https://visitfourcorners.com/wp-content/uploads/2024/10/Betatakin-Navajo-National-Monument-Arizona-C-Fallstead.png', location: 'Navajo National Monument, Arizona', position: 8, created_at: new Date().toISOString(), latitude: 36.9286, longitude: -116.0858 },
      { id: 'us9', trip_id: 'am4', name: 'Four Corners Monument', description: 'Quadripoint where Utah, Colorado, Arizona, and New Mexico meet.', image: 'https://i0.wp.com/moderatelyadventurous.com/wp-content/uploads/2018/08/Photo-Aug-06-12-44-51-PM-2.jpg?resize=1200%2C550&ssl=1', location: 'Four Corners, USA', position: 9, created_at: new Date().toISOString(), latitude: 36.9286, longitude: -116.0858 }
    ],
    ratings: []
  }
];

type FilterState = {
  search: string;
  difficulty: string;
  duration: string;
  sortBy: string;
  region: string;
};

const REGION_BUTTONS = [
  { value: "all", label: "ALL REGIONS" },
  { value: "europe", label: "EUROPE" },
  { value: "asia-pacific", label: "ASIA-PACIFIC" },
  { value: "americas", label: "AMERICAS" },
  { value: "rest", label: "REST OF WORLD" }
];

const ExplorePage: React.FC = () => {
  const [allTrips, setAllTrips] = useState<RoadTrip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<RoadTrip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useLocalData, setUseLocalData] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    difficulty: '',
    duration: '',
    sortBy: 'rating',
    region: 'all'
  });
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedTripId = queryParams.get('selectedTrip');
  const [selectedTrip, setSelectedTrip] = useState<RoadTrip | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const trips = await api.getTrips();
        const enrichedSampleTrips = sampleTrips.map((trip) => {
          const state = api.getBuiltinTripState(trip.id);
          return {
            ...trip,
            likesCount: state.likesCount,
            shareCount: state.shareCount,
            likedByMe: state.likedByMe,
            savedByMe: state.savedByMe,
            comments: state.comments,
            ratings: state.ratings,
            averageRating: state.averageRating || trip.averageRating,
          };
        });
        // Always show both demo trips and database trips
        const combinedTrips = [...enrichedSampleTrips, ...trips];
        setAllTrips(combinedTrips);
        setFilteredTrips(combinedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setUseLocalData(true);
        const enrichedSampleTrips = sampleTrips.map((trip) => {
          const state = api.getBuiltinTripState(trip.id);
          return {
            ...trip,
            likesCount: state.likesCount,
            shareCount: state.shareCount,
            likedByMe: state.likedByMe,
            savedByMe: state.savedByMe,
            comments: state.comments,
            ratings: state.ratings,
            averageRating: state.averageRating || trip.averageRating,
          };
        });
        setAllTrips(enrichedSampleTrips);
        setFilteredTrips(enrichedSampleTrips);
        toast({
          title: "Connection error",
          description: "Could not connect to the database. Using sample trips instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId && allTrips.length > 0) {
      const trip = allTrips.find(trip => trip.id === selectedTripId);
      setSelectedTrip(trip || null);
    } else {
      setSelectedTrip(null);
    }
  }, [selectedTripId, allTrips]);

  const handleCloseTripDetail = () => {
    navigate('/explore');
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [filters, allTrips]);

  const applyFilters = () => {
    let filtered = [...allTrips];

    if (filters.region && filters.region !== 'all') {
      if (filters.region === 'rest') {
        filtered = filtered.filter(trip =>
          !trip.location.toLowerCase().includes('europe') &&
          !trip.location.toLowerCase().includes('asia-pacific') &&
          !trip.location.toLowerCase().includes('americas')
        );
      } else {
        filtered = filtered.filter(trip =>
          trip.location.toLowerCase().includes(filters.region)
        );
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(searchLower) ||
        trip.description.toLowerCase().includes(searchLower) ||
        trip.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.difficulty && filters.difficulty !== 'all-difficulties') {
      filtered = filtered.filter(trip => trip.difficulty === filters.difficulty);
    }

    if (filters.duration && filters.duration !== 'all-durations') {
      switch (filters.duration) {
        case 'short':
          filtered = filtered.filter(trip => trip.duration <= 3);
          break;
        case 'medium':
          filtered = filtered.filter(trip => trip.duration > 3 && trip.duration <= 7);
          break;
        case 'long':
          filtered = filtered.filter(trip => trip.duration > 7);
          break;
      }
    }

    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'distance':
        filtered.sort((a, b) => b.distance - a.distance);
        break;
      case 'duration':
        filtered.sort((a, b) => b.duration - a.duration);
        break;
    }

    setFilteredTrips(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      difficulty: '',
      duration: '',
      sortBy: 'rating',
      region: 'all'
    });
  };

  const handleTripClick = (trip: RoadTrip) => {
    navigate(`/explore?selectedTrip=${trip.id}`);
  };

  return (
    <Layout>
      {selectedTrip ? (
        <TripDetailPage tripData={selectedTrip} onClose={handleCloseTripDetail} disableLayout />
      ) : (
        <>
          <div className="bg-white py-16">
            <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Explore Road Trips</h1>
              <p className="text-lg text-gray-700 mb-8 max-w-3xl">
                Discover amazing road trip adventures shared by our community.
                Find your next journey based on location, difficulty, or duration.
              </p>
              <div className="bg-white rounded-lg p-4 flex items-center">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Search by destination, name, or description..."
                  className="border-0 focus-visible:ring-0"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-16 bg-white">
            <div className="flex items-center gap-5 mb-8">
              <span className="text-sm sm:text-base font-medium min-w-[68px]">Region:</span>
              <div className="overflow-x-auto max-w-full sm:overflow-visible">
              <ToggleGroup
                type="single"
                value={filters.region}
                onValueChange={val => {
                  if (val) setFilters(prev => ({ ...prev, region: val }));
                }}
                  className="rounded-lg border bg-muted shadow-sm gap-0 min-w-max"
              >
                {REGION_BUTTONS.map((btn) => (
                  <ToggleGroupItem
                    key={btn.value}
                    value={btn.value}
                    className={`px-5 py-2 data-[state=on]:bg-gray-100 data-[state=on]:text-black
                   text-gray-700 font-semibold rounded-none border-r last:border-r-0 
                   border-gray-200 text-base hover:bg-gray-50 transition-all`}
                    style={{
                      borderTopLeftRadius: btn.value === "all" ? "0.5rem" : undefined,
                      borderBottomLeftRadius: btn.value === "all" ? "0.5rem" : undefined,
                      borderTopRightRadius: btn.value === "rest" ? "0.5rem" : undefined,
                      borderBottomRightRadius: btn.value === "rest" ? "0.5rem" : undefined
                    }}
                  >
                    {btn.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-auto">
                  <Select
                    value={filters.difficulty}
                    onValueChange={(value) => handleFilterChange('difficulty', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-difficulties">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto">
                  <Select
                    value={filters.duration}
                    onValueChange={(value) => handleFilterChange('duration', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-durations">All Durations</SelectItem>
                      <SelectItem value="short">Short (1-3 days)</SelectItem>
                      <SelectItem value="medium">Medium (4-7 days)</SelectItem>
                      <SelectItem value="long">Long (8+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              </div>
              <div className="w-full sm:w-auto">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="distance">Longest Distance</SelectItem>
                    <SelectItem value="duration">Longest Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {useLocalData && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  Using sample trip data. {" "}
                  {filteredTrips.length === 0 ? "Try clearing your filters to see the sample trips." : ""}
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 rounded-xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => (
                  <div key={trip.id} className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => handleTripClick(trip)}>
                    <RoadTripCard trip={trip} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No trips found</h3>
                <p className="text-gray-600 mb-6">
                  No road trips match your current search criteria.
                  Try changing your filters or search term.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ExplorePage;
