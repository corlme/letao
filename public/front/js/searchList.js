$(function(){
    // 获取搜索框的值
    //   调用已经封装好的 解析地址栏参数的函数 getSearch()
    var key = getSearch( "key" );
    // 赋值给搜索页面的搜索框
     $(".search_input").val( key );
     // 一进入页面 渲染一次
    render();

     // 根据搜索关键词 发送请求 进行页面渲染
   function render(){
       $.ajax({
           type:"get",
           url:"/product/queryProduct",
           data: {
               proName: $(".search_input").val(),
               page:1,
               pageSize:100
           },
           dataType:"json",
           success:function( info ){
               console.log(info);
               var htmlStr = template("productTpl",info);
               $(".lt_product").html(htmlStr);
           }
       });
   }

    // 搜索添加功能
    $(".search_btn").click(function(){

  // 还需要将搜索关键字追加到本地存储中
        // 1.获取input框的值
        var key = $("search_input").val();

             // 1.1追加一个非空判断
        if( key.trim() === '' ){
            alert("请输入关键词");
            return;
        }

        render();


        // 2.获取本地历史记录数组 需要将jsonStr 转存 arr
        var history = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse( history );

             // 2.1 加两个判断 删除重复项
        var index = arr.indexOf( key ); //找到关键字的索引
        if( index != -1 ){ //说明有重复项
            arr.splice( index, 1 );
        }
             // 2.2 长度不能超过10个
        if( arr.length >= 10 ){
            // 删除数组最后一项
            arr.pop();
        }

        // 3.将关键字追加到数组最前面，新的数组
        arr.unshift( key );

        // 转存 jsonStr 字符串存储到本地
        localStorage.setItem( "search_list", JSON.stringify( arr ) );
    })

});