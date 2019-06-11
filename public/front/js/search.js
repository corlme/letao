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

    // 功能2.情况历史记录功能
    //  （1）注册事件，通过事件委托注册
    // （2）清空历史记录 removeItem
    // （3）页面重新渲染
    $(".lt_history").on("click",".btn_empty",function(){
        // 清空记录
        localStorage.removeItem("search_list");
        // 页面重新渲染
        render();
    })


});