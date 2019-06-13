$(function() {

    var currentPage = 1;
    var pageSize = 2;

// 整个页面的核心方法 render
    // 在 render 方法中, 处理了所有的参数
    function render( callback ) {
        // $('.lt_product').html('<div class="loading"></div>');

        var params = {};
        // 1. 必传的 3 个参数
        params.proName = $('.search_input').val();
        params.page = currentPage;
        params.pageSize = pageSize;

        // 2. 两个可传可不传的参数
        //    (1) 通过判断有没有高亮元素, 决定是否需要排序
        //    (2) 通过箭头方向判断, 升序还是降序  1升序，2降序
        var $current = $('.lt_sort a.current');
        if ( $current.length > 0 ) {
            // 有高亮的, 需要进行排序
            var sortName = $current.data("type");
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            params[ sortName ] = sortValue;
        }

        setTimeout(function() {
            $.ajax({
                type: "get",
                url: "/product/queryProduct",
                data: params,
                dataType: "json",
                success: function( info ) {
                   callback && callback( info );
                }
            })
        }, 500 );

    }

    // 功能1: 获取地址栏参数赋值给 input
    var key = getSearch("key");
    $('.search_input').val( key );
    // render();


    // 配置下拉刷新和上拉加载注意点：
    //  下拉刷新是对原有的数据进行覆盖，执行的是  html()方法
    //                 var htmlStr = template("productTpl", info );
    //                 $('.lt_product').html( htmlStr );
    //  上拉加载是在原有的结构后面进行追加，执行的是  append() 方法
    //                 var htmlStr = template("productTpl", info );
    //                 $('.lt_product').append( htmlStr );

    // 利用插件 mui 实现下拉刷新效果
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true, //配置一进入页面就刷新
                callback: function(){  //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    console.log("下拉刷新了");

                    // 永远刷新第一页数据
                    currentPage = 1;

                    // 然后页面渲染
                    render(function( info ){
                        var htmlStr = template("productTpl", info );
                        $('.lt_product').html( htmlStr );

                        // 在发送 ajax 请求 完成后，需要结束 下拉刷新
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

                        // 在刷新完第一页数据后，还需要重新启用 上拉加载 的效果
                        mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();

                    });
                }
            },

            // 上拉加载...
            up : {
                callback: function(){   //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    console.log("上拉加载了");

                    // 上拉加载的是下一页 需要更新当前页
                    currentPage++;

                    render( function( info ){
                        var htmlStr = template("productTpl", info );

                        // 注意： 上拉加载是 追加 这里把 html 换成 append
                        // $('.lt_product').append( htmlStr );
                        $('.lt_product').append( htmlStr );

                        // 当数据回来之后，需要结束上拉加载：
                        //   endPullupToRefresh(boolean) 结束上拉加载
                        //   1.如果传true，就是表示禁用上拉加载，防止发送无效的 ajax 请求
                        //   2.如果传 false 就是还有更多数据，可以继续加载

                        if( info.data.length === 0){ //说明没有更多数据了，需要禁用,显示提示语
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( true );
                        }
                        else{  //还有数据，正常结束上拉加载
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( false );
                        }

                    });
                }
            }
        }
    });




    // 功能2: 点击搜索按钮, 实现搜索功能
    $('.search_btn').click(function() {
        var key = $('.search_input').val(); // 获取搜索关键字
        if ( key.trim() === "" ) {
            mui.toast("请输入搜索关键字");
            return;
        }

        // 在点击搜索功能时，调用下 下拉刷新就可以了
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

        // 有搜索内容, 需要添加到本地存储中
        var history = localStorage.getItem("search_list") || '[]'; // jsonStr
        var arr = JSON.parse( history ); // 转成数组

        // 要求:
        // 1. 不能重复
        var index = arr.indexOf( key );
        if ( index != -1 ) {
            // 删除对应重复项
            arr.splice( index, 1 );
        }
        // 2. 不能超过 10
        if ( arr.length >= 10 ) {
            // 删除最后一项
            arr.pop();
        }

        // 往数组最前面追加
        arr.unshift( key );
        // 转成 json, 存到本地
        localStorage.setItem( "search_list", JSON.stringify( arr ) );
    })


    // 功能3: 添加排序功能(点击切换类即可)
    // (1) 自己有current, 切换箭头方向
    // (2) 自己没有current, 给自己加上, 让其他的移除 current

    // mui 认为在下拉刷新和上拉加载容器中, 使用 click 会有 300ms延迟的话, 性能方面不足
    // 禁用了默认的 a 标签的 click 事件, 需要绑定 tap 事件
    // http://ask.dcloud.net.cn/question/8646 文档说明地址
    $('.lt_sort a[data-type]').on("tap",function() {
        if ( $(this).hasClass("current") ) {
            // 切换箭头方向
            $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        }
        else {
            // 没有 current, 给自己加上, 并排他
            $(this).addClass("current").siblings().removeClass("current");
        }

        // 第一种方法：调用一次 下拉刷新 就可以了
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

        // 第二种方法：还是调用 render()渲染
        // render(function( info ){
        //     var htmlStr = template("productTpl", info );
        //     $('.lt_product').html( htmlStr );
        //
        //     // 在发送 ajax 请求 完成后，需要结束 下拉刷新
        //     mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        //
        //     // 在刷新完第一页数据后，还需要重新启用 上拉加载 的效果
        //     mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
        // });
    })


    // 功能4.点击每个商品，实现页面跳转
    $(".lt_product").on("tap","a",function(){
        var id = $(this).data("id");
        location.href = "product.html?productId=" + id;
    })




});