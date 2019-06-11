$(function(){
    // 1.一进入页面就发送ajax请求，获取一级类目数据，通过模板引擎渲染
    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        dataType:"json",
        success:function(info){
            console.log(info);
            var htmlStr = template("leftTpl",info);
            $(".lt_category_left ul").html(htmlStr);

            // 一进入页面，渲染第一个一级分类 所对应的二级分类
            renderSecondById( info.rows[0].id );

        }
    });


    // 2.点击一级分类，渲染二级分类（注册事件委托）
    $(".lt_category_left").on("click",'a',function(){
        // 点击让当前一级分类高亮（通过添加和移除 current类）
        $(this).addClass("current").parent().siblings().children("a").removeClass("current");
        // 先获取 id 通过id 进行二级分类渲染
        var id = $(this).data("id");
        renderSecondById( id );
    });

    // 实现一个方法，专门根据一级分类的 id 去渲染二级分类
     function renderSecondById( id ){

         // 二级分类页渲染
         $.ajax({
             type:"get",
             url:"/category/querySecondCategory",
             data:{
                 id: id
             },
             dataType:"json",
             success:function(info){
                 console.log(info);
                 var htmlStr = template("rightTpl",info);
                 $(".lt_category_right ul").html(htmlStr);
             }

         })
     }


});