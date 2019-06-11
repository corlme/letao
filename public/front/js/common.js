

// mui 插件 给所有页面实现区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
    interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
});

// 作用：解析地址栏参数
function getSearch( k ){
    // 获取地址栏参数
    var search = location.search; //"?name=pp&age=18&desc=%E5%B8%85"

    // 将其解码成中文
    search = decodeURI( search ); //"?name=pp&age=18&desc=帅"

    // 去掉 ？ slice( start, end ) 从start开始取值到end结束 传1：就是从 1 开始 取所有值
    search = search.slice( 1 ); //"name=pp&age=18&desc=帅"

    // 通过 & 分割成数组. split 截取
    var arr = search.split( "&" ); // ["name=pp", "age=18", "desc=帅"]

    // 将数组转换成 键：值 的对象
    var obj = {};
    arr.forEach(function( v, i ){  //v 表示每项 "name=pp"
        var key = v.split("=")[0]; //name
        var value = v.split("=")[1]; //pp
        // 存到对象中。[]会解析变量
        obj[ key ] = value;
    });
    // console.log(obj.desc); //帅
    return obj[ k ];
};
