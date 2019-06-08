$(function(){
    // 使用Echarts插件 生成图标
    //  1.引包
    // 2.准备具备宽高的容器
    // 3.复制粘贴，进行初始化

// 柱状图
    // 基于准备好的dom，初始化echarts实例
    var echarts_1 = echarts.init(document.querySelector(".echarts_1"));

    // 指定图表的配置项和数据
    var option1 = {
        // 大标题
        title: {
            text: '2017年注册人数'
        },
        // 提示框组件
        tooltip: {
            trigger:"item"
        },
        // 图例
        legend: {
            data:['人数']
        },
        // x轴的刻度
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        // y轴的刻度, 一般不设置, 根据数据动态生成
        yAxis: {},
        series: [{
            name: '人数',
            // bar柱状图  line 折线图 pie 饼图
            type: 'bar',
            data: [1500, 2000, 3000, 1000, 1200, 2000]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_1.setOption(option1);


    // 饼图
    // 基于准备好的dom，初始化echarts实例
    var echarts_2 = echarts.init(document.querySelector(".echarts_2"));

    // 指定图表的配置项和数据
    option2 = {
        title : {
            text: '热门品牌销售',
            subtext: '2017年6月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            // 配置提示信息
           // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // 图例
        legend: {
            // horizontal 可以让图例水平显示 vertical：垂直显示
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','新百伦','李宁','阿迪王']
        },
        series : [
            {
                name: '品牌',
                type: 'pie',
                radius : '55%',
                // 圆心的坐标位置
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'新百伦'},
                    {value:135, name:'李宁'},
                    {value:1548, name:'阿迪王'}
                ],
                // 添加阴影效果
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_2.setOption(option2);

});