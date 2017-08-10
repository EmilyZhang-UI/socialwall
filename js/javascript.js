$.ajax({
  url: "https://raw.githubusercontent.com/EmilyZhang-UI/socialwall/master/data/posts.json"
}).done(function(data){
  data = JSON.parse(data);
  console.log(data);
});
