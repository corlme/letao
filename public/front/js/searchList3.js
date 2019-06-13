$(function(){
    // 功能1.获取地址栏参数，赋值给input
    var key = getSearch( key );  // getSearch()已经封装好的方法：获取地址栏参数
    $(".search_input").val( key );
    render();


    // 功能2.点击搜索按钮，实现搜索功能
    $(".search_btn").click(function(){
        // 获取搜索关键字
        var key = $(".search_input").val();
        if( key.trim() === '' ){
            mui.toast("请输入搜索关键字");
            return;
        }
        // 有搜索关键字 渲染页面
        render();
        // 除了渲染页面，还要把关键字添加到本地存储中
        var history = localStorage.getItem("search_list") || '[]';  //得到 jsonStr 字符串
        var arr = JSON.parse( history ); // 转存数组

        // 这里做个判断：
        // (1)关键字不能重复
        // (2)历史记录不能超过10个
        var index = arr.indexOf( key );//获得这个关键词的索引
        if( index != -1 ){  //说明有重复项 那就删除
            arr.splice( index, 1 );
        }
        if( arr.length >= 10 ){
            // 删除数组的最后一项
            arr.pop();
        }
        // 还要往数组的前面追加关键词
        arr.unshift( key );
        // 转存 jsonStr 储存到本地
        localStorage.setItem("search_list", JSON.stringify( arr ) );

    })


    // 功能3.添加排序功能（点击切换类即可）
    // (1)自己有 current类 切换箭头方向即可
    // (2)自己没有current类 给自己加上，移除兄弟的
    $(".lt_sort a[data-type]").click(function(){
        if( $(this).hasClass("current") ){
            // 切换箭头方向
            $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        }
        else {
            $(this).addClass("current").siblings().removeClass("current");
        }
        // 渲染页面
        render();
    });

    // 整个页面的核心方法 render()
    //    render()方法中，处理了所有参数
    function render(){
        // 准备请求数据，渲染时，显示加载中的效果
        $(".lt_product").html('<div class="loading"></div>');

        // 首先处理参数
        var params = {};
        // (1)必传的 3 个 参数
        params.proName = $("search_input").val(); //输入的搜索关键字
        params.page = 1;
        params.pageSize = 100;
        // (2)  2 个 可传可不传 的参数 (控制排序的)
        //  1.通过判断有没有高亮元素。决定是否需要排序
        // 2.通过箭头方向判断升序还是降序 1升序 2降序
        var $current = $(".lt_sort a.current");
        if( $current.length > 0 ){
            // 说明有高亮，需要排序
            // 获取当前高亮的元素 和 对应的值（通过箭头方向 判断 1 还是 2）
            var sortName = $current.data("type");
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            // 追加到参数列表中
            params[ sortName ] = sortValue;
        }

        setTimeout(function(){
            $.ajax({
                type:"get",
                url:"/product/queryProduct",
                data: params,
                dataType:"json",
                success:function(info){
                    var htmlStr = template("productTpl",info);
                    $(".lt_product").html( htmlStr );
                }
            })
        },500)
    }

});