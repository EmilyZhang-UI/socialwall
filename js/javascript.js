$.ajax({
  url: "https://raw.githubusercontent.com/EmilyZhang-UI/socialwall/master/data/posts.json"
}).done(function(data){
  data = JSON.parse(data);
  items = data.items;
  createPost(items);
});

function createPost(items){
  posts_list = document.getElementById("posts_list");
  items.sort(function(a,b){
    var a_date = new Date(a.item_published).getTime();
    var b_date = new Date(b.item_published).getTime();
    return b_date - a_date;
  });
  items.forEach(function(ele,index){
    switch (ele.service_name) {
      case "Manual":
        var text = "<div class='post col-xs-12 col-sm-4 col-md-4'><div><a href='"+ele.item_data.link+"' target='_blank'>"
        +"<img src='"+ele.item_data.image_url+"'/></a></div><div class='text'>"+ele.item_data.text
        +"</div><a href='"+ele.item_data.link+"' target='_blank'><div class='linkTxt'>"
        +ele.item_data.link_text+"</div></a></div>";
        break;
      case "Twitter":
        var text = "<div class='post col-xs-12 col-sm-4 col-md-4'><div class='tw_username'>"+ele.item_data.user.username+"</div>"
        + "<div class='tweet'>"+ele.item_data.tweet+"</div></div>";
        break;
      case "Instagram":
        var text = "<div class='post col-xs-12 col-sm-4 col-md-4'><div><a href='"+ele.item_data.link+"' target='_blank'><img src='"+ele.item_data.image.large+"'/></a>"
        + "</div><div class='ins_username'>"+ele.item_data.user.username+"</div>"
        +"<div class='firstStr'>"+splitStr(ele.item_data.caption).first_str+"</div>"
        +"<div class='secondStr'>"+splitStr(ele.item_data.caption).second_str+"</div></div>";
        break;
      default:
        break;
    }
    posts_list.innerHTML += text;
  });
}
function splitStr(str){
  var index = str.indexOf("#");
  this.first_str = str.slice(0,index);
  this.second_str = str.slice(index);
  return this;
}
function splitTwStr(str){
  var index = str.indexOf("@");
  this.first_str = str.slice(0,index);
  this.second_str = str.slice(index);
  for (var i = 0; i < second_str.length; i++) {
    if(second_str.charCodeAt(i) <= 126 && second_str.charCodeAt(i)>=32){
      this.user_str = second_str.slice(0,i);
      this.rest_str = second_str.slice(i);
      splitTwStr(rest_str);
    }
  }
  return this;
}
function filterByName(e){
  var array = items.filter(function(ele,index){
    return ele.service_name == e.target.innerHTML;
  });
  posts_list.innerHTML = "";
  createPost(array);
}
