function Market(opt){
  var m=new MarketPanel({
      url:opt.url,
      type:opt.types
  })
  $("#asks .dish-hands").children('ul').empty();
  $("#bids .dish-hands").children('ul').empty();
  m.reloads();
  setInterval(function(){
      m.reloads();
  },2000)
}