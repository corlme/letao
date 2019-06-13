$(function(){
   // 注意：要进行本地存储 localStorage 的操作，进行历史记录管理
   //          需要约定一个 键名： search_list
   //          将来通过 search_list 进行读取或设置操作

    // 准备假数据:将下面代码在控制台执行
    // var arr = ["耐克","阿迪","耐克王","阿迪王","新百伦"];
    //  var jsonStr = JSON.stringify(arr);
    //  localStorage.setItem("search_list",jsonStr);

    // 功能1.列表渲染功能
    // 1.从本地存储中读取历史记录，读取的是 jsonStr
    // 2.转成数组
    // 3.通过模板引擎渲染
      render();
    // 封装方法：从本地读取历史记录，以数组的形式返回
     function getHistory(){
         // 读取数据. []: 表示如果没有读取到历史记录，默认初始化一个空数组
         var history = localStorage.getItem("search_list") || '[]';  //得到 jsonStr 字符串
         // 转成数组
         var arr = JSON.parse( history );
         return arr;
     }
     // 读取数组，进行页面渲染
    function render(){
        var arr = getHistory();
        var htmlStr = template("historyTpl", { arr: arr } );
        $(".lt_history").html(htmlStr);
    }

    // 功能2.清空历史记录功能
    //  （1）注册事件，通过事件委托注册
    // （2）清空历史记录 removeItem
    // （3）页面重新渲染
    $(".lt_history").on("click",".btn_empty",function(){

        // 添加删除 确认框 （mui插件提供）
        // mui.confirm() 参数
        //  1.message ：提示的文本内容
        // 2.title 确认框的 标题
        // 3.btnValue ：按钮的文本,是一个数组
        // 4.callback：点击按钮后的回调函数
        mui.confirm("你确定要清空历史记录吗？", "温馨提示",['取消','确定'],function( e ){
            // e.index 可以获取点击按钮对应的下标：1：是确认按钮  0是取消按钮
            if( e.index === 1 ){
                // 清空记录
                localStorage.removeItem("search_list");
                // 页面重新渲染
                render();
            }
        });
    })

    // 功能3. 删除单条历史记录
    // (1).注册事件 通过事件委托
    // (2) 将下标存储到删除按钮上，获取存储的下标
    // (3).从本地存储中读取数据 获取数组
    // (4).通过下标 从 数组 中删除 对应项 删除数组方法 splice
    // (5).将修改后的数组 ，转存 jsonStr ，存到本地存储上
    // (6). 页面重新渲染
    $(".lt_history").on("click",".btn-del",function(){
        // 将外层的 this 指向 存储到 that 中
        var that = this;

        // 添加删除确认框
        mui.confirm("你确定要删除本条记录吗？","温馨提示",["取消","确认"],function( e ){
            if( e.index === 1 ){  //1:表示 确认键
                // 获取下标
                var index = $(that).data("index");
                // 获取数组 调用已经封装的方法
                var arr = getHistory();
                // 根据下标，删除数组的对应项
                // splice(从哪里开始，删除几项，添加的项1，添加的项2 ...)
                arr.splice( index, 1 );
                // 转存 jsonStr 字符串，存储到本地上
                var jsonStr = JSON.stringify( arr );
                localStorage.setItem("search_list",jsonStr);
                // 页面重新渲染
                render();
            }
        })
    })


    // 功能4.添加历史记录功能
    // (1).给搜索按钮，添加点击事件
    // (2).获取输入框的值
    // (3).获取本地历史中储存的数组
    // (4).往数组的最前面追加
    // (5).转换成 jsonStr，将修改后的数组 存储到本地存储中
    // (6).页面重新渲染
    $(".search_btn").click(function(){
        // 获取输入框的关键词
        var key = $(".search_input").val().trim(); //trim()用于去取字符串两端的空白字符
        if( key === "" ){
            mui.toast("请输入搜索关键字",{
                duration:3000 //显示时长
            });
            return;
        }

        // 获取数组
        // var history = localStorage.getItem("search_list");
        // var arr = JSON.parse( history );
        var arr = getHistory();

        // 需求：
         //（1）如果有重复的，先将重复的删除，将这项添加到最前面
        // (2)长度不能超过10个，如果超多了删除最后一项
        var index = arr.indexOf( key ); // key的值就是 之前搜索框中输入的值，indexOf 就是查找这个 key 的值得下标
        if( index != -1 ){  //说明在数组中有重复的项，且索引为 index
            arr.splice( index,1);
        }
        if( arr.length >= 10 ){
            arr.pop(); //pop() 删除最后一项
        }

        // 往数组的最前面追加
        arr.unshift( key );

        // 转存 jsonStr 字符串，将修改后的数组重新存储在本地
        // var jsonStr = JSON.stringify( arr );
        // localStorage.setItem("search_list",jsonStr);
        localStorage.setItem("search_list", JSON.stringify(arr) );
        // 页面重新渲染
        render();
        // 清空搜索框
        $(".search_input").val("");

        // 点击 搜索 按钮 页面跳转
        location.href = "searchList.html?key=" + key;
    })


});