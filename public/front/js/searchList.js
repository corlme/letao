$(function(){
    // 功能1: 获取地址栏传递过来的搜索关键字, 设置给 input
    //   调用已经封装好的 解析地址栏参数的函数 getSearch()
    var key = getSearch( "key" );
    // 赋值给搜索页面的搜索框
     $(".search_input").val( key );
     // 一进入页面 渲染一次
    render();

     // 根据搜索关键词 发送请求 进行页面渲染
   function render(){
    // 准备请求数据，渲染时，显示加载中的效果
       $(".lt_product").html('<div class="loading"></div>');
       // 定义参数对象
       var params = {};
       // 三个必传的参数
       params.proName = $(".search_input").val();
       params.page = 1;
       params.pageSize = 100;
       // 三个可传可不传的参数
       // (1)需要根据高亮的 a 来判断传哪个参数
       // (2) 通过箭头判断，升序还是降序
       //       价格：price   1升序  2降序
       //       库存：num     1升序  2降序
       var $current = $(".lt_sort a.current");
       if( $current.length > 0 ){ //说明有高亮的 a 需要排序
        // 获取传给后台的键
           var sortName = $current.data("type");
           // 获取传给后台的值，通过箭头方向判断升序还是降序
           var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
           // 添加到 params 参数对象中
           params[ sortName ] = sortValue;

       }

       // 模拟网路延迟，给ajax加个延时，为了展示 加载中的效果
       setTimeout(function(){
           $.ajax({
               type:"get",
               url:"/product/queryProduct",
               data: params,
               dataType:"json",
               success:function( info ){
                   console.log(info);
                   var htmlStr = template("productTpl",info);
                   $(".lt_product").html(htmlStr);
               }
           })
       },500)

   }

    //功能2 搜索添加功能
    $(".search_btn").click(function(){

  // 还需要将搜索关键字追加到本地存储中
        // 1.获取input框的值
        var key = $(".search_input").val();

             // 1.1追加一个非空判断
                    if( key.trim() === "" ){
                        mui.toast("请输入搜索关键字",{
                            duration:3000  //显示时间
                        });
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

    // 功能3 排序功能
    // 通过属性选择器给价格和库存添加点击事件
    // (1)如果自己有current类 切换箭头的方向即可
    // (2)如果自己没有current类 给自己添加 移除兄弟的
    $(".lt_sort a[data-type] ").click(function(){
        if($(this).hasClass("current")){
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }
        else {   //自己没有current类
             $(this).addClass("current").siblings().removeClass("current");
        }

        // 页面重新渲染即可,因为所有的参数，都是render中 实时获取处理好了
          render();
    })
});