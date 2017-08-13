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
        var text = "<div class='post grid_item'><div><a href='"+ele.item_data.link+"' target='_blank'>"
        +"<img src='"+ele.item_data.image_url+"'/></a></div><div class='text'>"+ele.item_data.text
        +"</div><a href='"+ele.item_data.link+"' target='_blank'><div class='linkTxt'>"
        +ele.item_data.link_text+"</div></a></div>";
        break;
      case "Twitter":
        var tweet = format_characters(ele.item_data.tweet);
        var text = "<div class='post grid_item'><div class='tw_username'>"+ele.item_data.user.username+"</div>"
        + "<div class='tweet'>"+format_url(tweet)+"</div></div>";
        console.log(text);
        break;
      case "Instagram":
        var text = "<div class='post grid_item'><div><a href='"+ele.item_data.link+"' target='_blank'><img src='"+ele.item_data.image.large+"'/></a>"
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

function format_characters(str){
  var characters = [];
  var indexes = [];
  var right_indexes = [];

  var start_tag = "<span class='formatChar'>";
  var end_tag = "</span>";

  var patt = new RegExp(/^\w+$/);

  for(var i=0;i<str.length;i++){

    if(str[i] == "@" || str[i] == "#")
    {
      characters.push(str[i]);
      indexes.push(i);
    }else if(!patt.test(str[i]) && characters.length > 0){
      var char = characters.pop();
      right_indexes.push(i);
    }

  }

  var out_str = "";

  var current_left = 0, current_right = 0;
  for(var i=0; i<str.length; i++){
    if(i == indexes[current_left])
    {
      out_str += (start_tag+str[i]);
      current_left++;
    }
    else if(i == right_indexes[current_right])
    {
      out_str += (end_tag+str[i]);
      current_right++;
    }else{
      out_str += str[i];
    }

  }

  if(characters.length > 0)
  {
    if(patt.test(str[str.length - 1]))
    {
      out_str += end_tag;
    }
  }
  return out_str;
};
function format_url(str){
  var str_array = str.split("http:\/\/");
  var out_str = "";
  var patt = new RegExp(/^\w+$/);

  if(str_array.length == 1)
  {
    return str;
  }
  out_str += str_array[0];

  for(var index=1; index<str_array.length;index++)
  {
    if(str_array[index].indexOf(' ') != -1)
    {
      //the link is not the end of the string
      var temp_string = str_array[index].slice(0,str_array[index].indexOf(' '));

      var after_link = str_array[index].slice(str_array[index].indexOf(' '));

      if(patt.test(temp_string[temp_string.length-1]))
      {
        temp_string = "http:\/\/"+temp_string;
        temp_string = "<a class='formatUrl' href='"+temp_string+"' target='_blank'>"+temp_string+"</a>";
        out_str+=temp_string;
      }else{
        temp_string = "http:\/\/"+temp_string;
        var temp_url = temp_string.slice(0,temp_string.length-2);
        temp_string = "<a class='formatUrl' href='"+temp_url+"' target='_blank'>"+temp_string+"</a>";
        out_str+=temp_string;
      }

      out_str+=after_link;

    }else{
      //only the link left in the string
      var temp = str_array[index];
      if(patt.test(temp[temp.length-1]))
      {
        temp = "http:\/\/"+temp;
        temp = "<a class='formatUrl' href='"+temp+"' target='_blank'>"+temp+"</a>";
        out_str+=temp;
      }else{
        temp = "http:\/\/"+temp;
        var url = temp.slice(0,temp.length-2);
        temp = "<a class='formatUrl' href='"+url+"' target='_blank'>"+temp+"</a>";
        out_str+=temp;
      }
    }

  }
  return out_str;

};
function filterByName(e){
  var array = items.filter(function(ele,index){
    return ele.service_name == e.target.innerHTML;
  });
  posts_list.innerHTML = "";
  createPost(array);
}
$('#posts_list').infiniteScroll({
  // options
  path: '.pagination__next',
  append: '.post',
  history: false,
});
