/**
 * Created by kew on 2017/1/13.
 */
/***
 *
 * @param opt
 */
function kpager(opt) {
    //配置文件
    var config= {
        pagerid: opt.pagerid, //divID
        pno: 1, //当前页码
        total: opt.total, //总页码
        totalRecords: opt.totalRecords, //总数据条数
        isShowFirstPageBtn: true, //是否显示首页按钮
        isShowLastPageBtn: true, //是否显示尾页按钮
        isShowPrePageBtn: true, //是否显示上一页按钮
        isShowNextPageBtn: true, //是否显示下一页按钮
        isShowTotalPage: true, //是否显示总页数
        isShowCurrPage: true,//是否显示当前页
        isShowTotalRecords: true, //是否显示总记录数
        isGoPage: true,	//是否显示页码跳转输入框
        isWrapedPageBtns: true,	//是否用span包裹住页码按钮
        isWrapedInfoTextAndGoPageBtn: true, //是否用span包裹住分页信息和跳转按钮
        hrefFormer: '', //链接前部
        hrefLatter: '', //链接尾部
        gopageWrapId: opt.gopageWrapId,
        gopageButtonId: opt.gopageButtonId,
        gopageTextboxId: opt.gopageTextboxId,
        click:opt.click,
        lang: {
            firstPageText: '首页',
            firstPageTipText: '首页',
            lastPageText: language["user.operation.tips.info.18"],
            lastPageTipText: language["user.operation.tips.info.18"],
            prePageText: '上一页',
            prePageTipText: '上一页',
            nextPageText: '下一页',
            nextPageTipText: '下一页',
            totalPageBeforeText: '共',
            totalPageAfterText: '页',
            currPageBeforeText: '当前第',
            currPageAfterText: '页',
            totalInfoSplitStr: '/',
            totalRecordsBeforeText: '共',
            totalRecordsAfterText: '条数据',
            gopageBeforeText: '&nbsp;转到',
            gopageButtonOkText: '确定',
            gopageAfterText: '页',
            buttonTipBeforeText: '第',
            buttonTipAfterText: '页'
        }
    };

    var calNum=function () {
        //}
        //validate
        if(config.pno < 1) config.pno = 1;
        config.total = (config.total <= 1) ? 1: config.total;
        if(config.pno > config.total) config.pno = config.total;
        config.prv = (config.pno<=2) ? 1 : (config.pno-1);
        config.next = (config.pno >= config.total-1) ? config.total : (config.pno + 1);
        config.hasPrv = (config.pno > 1);
        config.hasNext = (config.pno < config.total);
    };

    var initEvents=function () {
        $(config.pagerid).on("click","a[handler=getPage]",function () {
            config.pno=$(this).attr("no")*1;
            //触发选择事件
            calNum();
            var res = false;
            if(config.click && typeof config.click == 'function'){
                res = config.click.call(this,$(this).attr("no")*1) || false;
            }
            refreshHtml();
            return res;
        });

        $(config.pagerid).on("click",".kkpager_btn_go",function () {
            var str_page = $(config.pagerid+"  "+config.gopageTextboxId).val();

            if(isNaN(str_page)){
                $(config.pagerid+"  "+config.gopageTextboxId).val(config.next);
                return;
            }
            var n = parseInt(str_page);
            if(n < 1) n = 1;
            if(n > config.total) n = config.total;
            config.pno=n;
            //触发换页
            calNum();
            if(config.click && typeof config.click == 'function'){
                res = config.click.call(this,config.pno) || false;
            }
            refreshHtml();
            //TODO
        });

        $(config.pagerid).on("focus blur keypress  ",".kkpager_btn_go_input",function (event) {
            config.pno=$(this).attr("no")*1;
            event=event?event:window.event;
            event=event.originalEvent?event.originalEvent:event;
            switch(event.type){
                case "keypress":
                    var code = event.keyCode || event.charCode;
                    //delete key
                    if(code == 8) return true;
                    //enter key
                    if(code == 13){
                        $(config.pagerid+" .kkpager_btn_go").trigger("click");
                        return false;
                    }
                    //copy and paste
                    if(event.ctrlKey && (code == 99 || code == 118)) return true;
                    //only number key
                    if(code<48 || code>57)return false;
                    return true;
                    break;
                case "focus":
                    var btnGo = $(config.pagerid+"  "+config.gopageButtonId);
                    btnGo.addClass("kkpager_btn_go");
                    $(config.pagerid+"  "+config.gopageTextboxId).attr('hideFocus',true);
                    $(config.pagerid+"  "+config.gopageTextboxId).addClass("kkpager_btn_go_input");
                    btnGo.show();
                    btnGo.css('left','10px');
                    $(config.pagerid+"  "+config.gopageTextboxId).addClass('focus');
                    btnGo.animate({left: '+=30'}, 50);
                    break;
                case "blur":
                    setTimeout(function(){
                        var btnGo = $(config.pagerid+"  "+config.gopageButtonId);
                        btnGo.addClass("kkpager_btn_go");
                        btnGo.animate({
                            left: '-=25'
                        }, 100, function(){
                            btnGo.hide();
                            $(config.pagerid+"  "+config.gopageTextboxId).removeClass('focus');
                        });
                    },400);
                    break;
            }
        });
    };

    var getPage=function (no) {
        //触发规则
        var handler=" javascript:void(0) ";
        handler+="handler='getPage' no='"+no+"' ";
        return handler;
    };

    var refreshHtml=function () {

        var str_first='',str_prv='',str_next='',str_last='';
        if(config.isShowFirstPageBtn){
            if(config.hasPrv){
                str_first = '<a '+getPage(1)+' title="'
                    +(config.lang.firstPageTipText || config.lang.firstPageText)+'">'+config.lang.firstPageText+'</a>';
            }else{
                str_first = '<span class="disabled">'+config.lang.firstPageText+'</span>';
            }
        }
        if(config.isShowPrePageBtn){
            if(config.hasPrv){
                str_prv = '<a '+getPage(config.prv)+' title="'
                    +(config.lang.prePageTipText || config.lang.prePageText)+'">'+config.lang.prePageText+'</a>';
            }else{
                str_prv = '<span class="disabled">'+config.lang.prePageText+'</span>';
            }
        }
        if(config.isShowNextPageBtn){
            if(config.hasNext){
                str_next = '<a '+getPage(config.next)+' title="'
                    +(config.lang.nextPageTipText || config.lang.nextPageText)+'">'+config.lang.nextPageText+'</a>';
            }else{
                str_next = '<span class="disabled">'+config.lang.nextPageText+'</span>';
            }
        }
        if(config.isShowLastPageBtn){
            if(config.hasNext){
                str_last = '<a '+getPage(config.total)+' title="'
                    +(config.lang.lastPageTipText || config.lang.lastPageText)+'">'+config.lang.lastPageText+'</a>';
            }else{
                str_last = '<span class="disabled">'+config.lang.lastPageText+'</span>';
            }
        }
        var str = '';
        var dot = '<span class="spanDot" ...</span>';
        var total_info='<span class="totalText">';
        var total_info_splitstr = '<span class="totalInfoSplitStr">'+config.lang.totalInfoSplitStr+'</span>';
        if(config.isShowCurrPage){
            total_info += config.lang.currPageBeforeText + '<span class="currPageNum">' + config.pno + '</span>' + config.lang.currPageAfterText;
            if(config.isShowTotalPage){
                total_info += total_info_splitstr;
                total_info += config.lang.totalPageBeforeText + '<span class="totalPageNum">'+config.total + '</span>' + config.lang.totalPageAfterText;
            }else if(config.isShowTotalRecords){
                total_info += total_info_splitstr;
                total_info += config.lang.totalRecordsBeforeText + '<span class="totalRecordNum">'+config.totalRecords + '</span>' + config.lang.totalRecordsAfterText;
            }
        }else if(config.isShowTotalPage){
            total_info += config.lang.totalPageBeforeText + '<span class="totalPageNum">'+config.total + '</span>' + config.lang.totalPageAfterText;;
            if(config.isShowTotalRecords){
                total_info += total_info_splitstr;
                total_info += config.lang.totalRecordsBeforeText + '<span class="totalRecordNum">'+config.totalRecords + '</span>' + config.lang.totalRecordsAfterText;
            }
        }else if(config.isShowTotalRecords){
            total_info += config.lang.totalRecordsBeforeText + '<span class="totalRecordNum">'+config.totalRecords + '</span>' + config.lang.totalRecordsAfterText;
        }
        total_info += '</span>';

        var gopage_info = '';
        if(config.isGoPage){
            gopage_info = '<span class="goPageBox">'+config.lang.gopageBeforeText+'<span class="kkpager_gopage_wrap" class="'+config.gopageWrapId.substr(1,config.gopageWrapId.length-1)+'">'+
                '<input type="button" class="'+config.gopageButtonId.substr(1,config.gopageButtonId.length-1)+'" class="kkpager_btn_go"  value="'
                +config.lang.gopageButtonOkText+'" />'+
                '<input type="text" class="'+config.gopageTextboxId.substr(1,config.gopageTextboxId.length-1)+'" class="kkpager_btn_go_input"  value="'+config.next+'" /></span>'+config.lang.gopageAfterText+'</span>';
        }

        //分页处理
        if(config.total <= 3){
            for(var i=1;i<=config.total;i++){
                if(config.pno == i){
                    str += '<span class="curr">'+i+'</span>';
                }else{
                    str += '<a '+getPage(i)+' title="'
                        +config.lang.buttonTipBeforeText + i + config.lang.buttonTipAfterText+'">'+i+'</a>';
                }
            }
        }else{
            if(config.pno <= 1){
                for(var i=1;i<=3;i++){
                    if(config.pno == i){
                        str += '<span class="curr">'+i+'</span>';
                    }else{
                        str += '<a '+getPage(i)+' title="'+
                            config.lang.buttonTipBeforeText + i + config.lang.buttonTipAfterText+'">'+i+'</a>';
                    }
                }
                str += dot;
            }else{
                // str += '<a '+getPage(1)+' title="'
                // 	+config.lang.buttonTipBeforeText + '1' + config.lang.buttonTipAfterText+'">1</a>';
                // str += '<a '+getPage(2)+' title="'
                // 	+config.lang.buttonTipBeforeText + '2' + config.lang.buttonTipAfterText +'">2</a>';
                str += dot;

                var begin = config.pno - 1;
                var end = config.pno + 1;
                if(end > config.total){
                    end = config.total;
                    begin = end - 2;
                    if(config.pno - begin < 2){
                        begin = begin-1;
                    }
//					}else if(end + 1 == this.total){
//						end = this.total;
                }
                for(var i=begin;i<=end;i++){
                    if(config.pno == i){
                        str += '<span class="curr">'+i+'</span>';
                    }else{
                        str += '<a '+getPage(i)+' title="'
                            +config.lang.buttonTipBeforeText + i + config.lang.buttonTipAfterText+'">'+i+'</a>';
                    }
                }
                if(end != config.total){
                    str += dot;
                }
            }
        }
        var pagerHtml = '<div>';
        if(config.isWrapedInfoTextAndGoPageBtn){
            pagerHtml += '<span class="infoTextAndGoPageBtnWrap">' + total_info + gopage_info + '</span>';
        }else{
            pagerHtml += total_info + gopage_info;
        }
        if(config.isWrapedPageBtns){
            pagerHtml += '<span class="pageBtnWrap">' + str_first + str_prv + str + str_next + str_last + '</span>'
        }else{
            pagerHtml += str_first + str_prv + str + str_next + str_last;
        }
        pagerHtml += '</div><div style="clear:both;"></div>';
        $(config.pagerid).addClass("kkpager");
        $(config.pagerid).html(pagerHtml);
    };


    calNum();
    refreshHtml();
    if(!this.inits||!this.inits[config.pagerid]){
        if(!this.inits){
            this.inits=[];
        }
        this.inits.push(config.pagerid);
        initEvents();
    }
}

function page1(pageNo, data,pagerId) {
    kpager({
        pagerid:pagerId,
        pno : pageNo,
        // 总页码
        total : Math.ceil(data.totalCount / data.pageSize),
        // 总数据条数
        totalRecords : data.totalCount,
        click : function(index) {
            if(typeof data.click=="function"){
                data.click(index);
            }
        },
        gopageWrapId		: '.kkpager_gopage_wrap',
        gopageButtonId		: '.kkpager_btn_go',
        gopageTextboxId		: '.kkpager_btn_go_input'

    });
};


function list1(pageId,num,size,loadDataCal,showDataCal) {
    var pageNumber=num?num:1,pageSize=size?size:10, list = [];

    $(pageId).empty();

    loadDataCal(pageNumber,pageSize, function(data,total) {
        showDataCal(data);
        list[pageNumber]=data;
        page1(pageNumber, {
            click : function(index) {
                pageNumber = index;
                loadDataCal(pageNumber,pageSize,function (data) {
                    showDataCal(data);
                    list[pageNumber]=data;
                });
            },
            totalCount : total*1,
            pageSize : pageSize,
            enforceInit:true
        },pageId);
    });
}


