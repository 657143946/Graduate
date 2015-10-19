/**
 * Created by Administrator on 2015/10/15.
 */
var jG_charts = {
    ready : function(){

        var me = this;

        dc_validation.ready('J_searchArea');

        $('.J_search').on('click',function(){

            if(dc_validation.submitValidate('J_searchArea')){
                var param = xy_beanUtil.creatBean('search_',[
                    {name : 'college'},
                    {name : 'major'},
                    {name : 'expJob'}
                ]);

                me.search(param);
            }
            else{
                jTip('学校与专业为必填项','提示');
            }

        });

        this.search({college : '',major : '电子商务', expJob : ''});


    },
    search : function(param){
        var me = this;
        $.post('/graduate/pieChart.json', param ,function(response){
            if(param.major.indexOf('专业') < 0){
                param.major = param.major + '专业';
            }

            $('.major').text(param.major);
            me.drawCharts( param , response);
        });
    },
    drawCharts : function( param , response ){
        var me = this;
        require.config({
            paths: {
                echarts: '/js'
            }
        });
        require(
            [
                'echarts',
                'echarts/chart/pie'
            ],
            function(ec){

                var jobs = response.data.jobs;

                $.each(jobs,function(index,arr){
                    $.each(arr,function(key,val){
                        if(key == 'key'){
                            jobs[index]['name'] = val;
                        }
                    });
                    //jobs.push({ name : key ,value : val});
                });

                var pieChart = ec.init(document.getElementById('pieCharts'));

                var optionPie = {
                    title: {
                        text: param.college,
                        subtext: param.major,
                        x: 'center',
                        y: 'center',
                        itemGap: 20,
                        textStyle : {
                            color : 'rgba(30,144,255,0.8)',
                            fontFamily : '微软雅黑',
                            fontSize : 20,
                            fontWeight : 'bolder'
                        },
                        subtextStyle : {
                            color : '#555',
                            fontFamily : '微软雅黑',
                            fontSize : 18,
                            fontWeight : 'bolder'
                        }
                    },
                    calculable : false,
                    series : [
                        {
                            name:'职业分布',
                            type:'pie',
                            radius : ['50%', '70%'],
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : true,
                                        formatter : "{b}\n{d}%"
                                    },
                                    labelLine : {
                                        show : true
                                    }
                                }
                            },
                            data:jobs
                        }
                    ]
                };

                pieChart.setOption(optionPie);

                var ecConfig = require('echarts/config');
                pieChart.on(ecConfig.EVENT.CLICK, function (value){
                    param.expJob = value.name;
                    me.drawRoute(param);
                });

                if(!param.expJob){
                    if(jobs.length > 0){
                        param.expJob = jobs[0].name;
                    }
                    else{
                        param.expJob = '产品经理';
                    }
                }

                me.drawRoute(param);

            }
        )
    },

    drawRoute : function(param){

        $.post('/graduate/careerRoute.json', param ,function(response){

            $('.expJob').text(param.expJob);

            require([
                'echarts',
                'echarts/chart/force'
            ],function(ec){

                var nodes = [];
                var links = [];
                var categories = [];
                var route = response.data.routes;

                $.each(route,function(indexArr,arr){
                    //var arr = valArr.split('@');

                    categories.push({name : indexArr});

                    $.each(arr,function(index,value){

                        if(index == 0){
                            value = param.expJob;
                            route[indexArr][index] = param.expJob;
                        }

                        //var value = val.replace(/[#]\S+/,'');
                        var flag = false;

                        if(indexArr == 0 && index == 0){
                            if(nodes.length == 0){
                                nodes.push({category:0, name: value, value : 5,itemStyle: {
                                    normal: {
                                        color : '#ffffff',
                                        borderColor : 'rgba(30,144,255,0.8)'
                                    }
                                }});
                            }
                        }
                        else{
                            $.each(nodes,function(){
                                if(value == this){
                                    flag = true;
                                    return false;
                                }
                            });
                            if(!flag){
                                nodes.push({category:indexArr, name: value, value : 3});
                            }
                        }

                        if(index != 0){
                            links.push({source : arr[index-1], target : value, weight : 1})
                        }
                    });
                });

                var forceChart = ec.init(document.getElementById('forceCharts'));

                var optionForce = {

                    color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
                        '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
                        '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
                        '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],

                    tooltip : {
                        trigger: 'item',
                        formatter: '{a} : {b}'
                    },
                    series : [
                        {
                            type:'force',
                            name : "职业发展路径",
                            ribbonType: false,
                            categories : categories,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: '#333'
                                        }
                                    },
                                    nodeStyle : {
                                        brushType : 'both',
                                        borderColor : 'rgba(255,215,0,0.4)',
                                        borderWidth : 1
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false
                                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                    },
                                    nodeStyle : {
                                        //r: 30
                                    },
                                    linkStyle : {}
                                }
                            },
                            minRadius : 15,
                            maxRadius : 25,
                            gravity: 1.1,
                            scaling: 1.2,
                            draggable: false,
                            linkSymbol: 'arrow',
                            steps: 10,
                            coolDown: 0.9,
                            //preventOverlap: true,
                            nodes : nodes,
                            links : links
                        }
                    ]
                };

                forceChart.setOption(optionForce);

            });

        });


    }
};