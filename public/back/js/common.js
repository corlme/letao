// 开启进度条
// NProgress.start() ;

// setInterval(function(){
// 结束进度条
//     NProgress.done();
// },2000);

// setTimeout(function(){
//     // 结束进度条
//     NProgress.done();
// },2000);

// 实现第一个ajax发送时，开启进度条
// 所有ajax发送完之后，结束进度条

// ajax全局处理事件：查看 jquery官网里面的：APIDocumentation 下面的 Ajax 第一条 Global Ajax Evnet Handles

// ajaxStart():在第一个ajax发送是 调用
$( document ).ajaxStart(function(){
    // 开启进度条
    NProgress.start();
});

// ajaxStop():在所有ajax发送完成后 调用
$( document ).ajaxStop(function(){
    // 关闭进度条
    // NProgress.done();

    // 模拟网路延迟 (实际工作中不要加)
    setTimeout(function(){
        NProgress.done();
    },500);
});