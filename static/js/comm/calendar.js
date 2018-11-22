var doc= document;
function Calendar(){
     this.init.apply(this,arguments);
}
Calendar.prototype={
	max_yyyyMM:null,
	min_yyyyMM:null,
//	init:function(tableId,dateId,selectY,selectM,startYear,endYear){
//		var table=doc.getElementById(tableId);
//		var dateObj=doc.getElementById(dateId);
//		var selectY=doc.getElementById(selectY);
//		var selectM=doc.getElementById(selectM);
////	    this._setSelectYear(selectY,startYear,endYear);
//		this._setTodayDate(table,selectY,selectM);
////	    this._selectChange(table,selectY,selectM);
//		this._clickBtn(table,dateObj,selectY,selectM,startYear,endYear);
//	},
	init:function(tableId,dateId,selectY,selectM,nowDate,minDate,maxDate){
	    var table=doc.getElementById(tableId);
	    var dateObj=doc.getElementById(dateId);
	    var selectY=doc.getElementById(selectY);
	    var selectM=doc.getElementById(selectM);
	    if(minDate){
	    	this.min_yyyyMM=minDate.getFullYear()+(minDate.getMonth()<9?"0":"")+(minDate.getMonth()+1);
	    }
	    if(maxDate){
	    	this.max_yyyyMM=maxDate.getFullYear()+(maxDate.getMonth()<9?"0":"")+(maxDate.getMonth()+1);
	    }
	    nowDate = nowDate||new Date();
//	    this._setSelectYear(selectY,startYear,endYear);
	    this._setTodayDate(table,nowDate,selectY,selectM);
//	    this._selectChange(table,selectY,selectM);
	    this._clickBtn(table,dateObj,selectY,selectM);
	},
	//设置年份
	_setSelectYear:function(selectY,startYear,endYear){
	    var html="";
	    var date=new Date();
	    if(!endYear){
	        var endYear=date.getFullYear();
	    }else{
	        var endYear=endYear;
	    }
	    for(var i=startYear;i<=endYear;i++){
	        var _option=document.createElement('option');
	        selectY.appendChild(_option);
	        _option.value=i;
	        _option.innerHTML=i;
	    }
	},
	//设置当天的时间
	_setTodayDate:function(table,date,selectY,selectM){
	    var _this=this;
	    var year=date.getFullYear(),month=date.getMonth(),_date=date.getDate(),day=date.getDay();
	    var n=parseInt(_date/7);
	    var l=n%7;
	    startTd = day;
	    var monthDays=this._getMonthDays(year,month);
//	    var td=table.getElementsByTagName('td');
	    var td=table.getElementsByTagName('tbody')[0].getElementsByTagName('td');
	    this._setSelectValue(selectY,year);
	    this._setSelectValue(selectM,month+1);
//	    this._showCalendar(table,year,month);
	    this.renderCalendar(table,year,month);
	   
	},
	//鼠标移入移出日期
	_mouseOn:function(obj){
	    obj.onmouseover=function(){
	        if(this.innerHTML){
	            this.style.background="#bbb";
	        }
	    }
	    obj.onmouseout=function(){
	        this.style.background="";
	    }
	},
	//下拉菜单选择日期
	_selectChange:function(table,selectY,selectM){
	    var _this=this;
	    selectY.onchange=function(){
	        var year=_this._getSelectValue(selectY);
	        var month=_this._getSelectValue(selectM)-1;
	        _this.renderCalendar(table,year,month);
	        
	    }
	    selectM.onchange=function(){
	        var year=_this._getSelectValue(selectY);
	        var month=_this._getSelectValue(selectM)-1;;
	        _this.renderCalendar(table,year,month);
	    }
	},
	//获取下拉菜单的默认值
	_getSelectValue:function(selectObj){
		return parseInt(selectObj.innerHTML);
	},
	//设置下拉菜单默认值
	_setSelectValue:function(selectObj,value){
		selectObj.innerHTML=value;
	},
	_clickBtn:function(table,dateObj,selectY,selectM){
	    var _this=this,year=0;
	    $(".year-prev").on("click",function(){
	    	if($(this).hasClass("disable")){
				return;
			}
		    year=_this._getSelectValue(selectY);
		    var month=_this._getSelectValue(selectM)-1;
		    if(month<=0){
		        month=12;
		        year--;
		    }
//		    if(!isYearOver(year)){
//		        return;
//		    }
		    _this._setSelectValue(selectM,month);
		    _this._setSelectValue(selectY,year);
		    _this.renderCalendar(table,year,month-1);
		});
		$(".year-next").on("click",function(){
			if($(this).hasClass("disable")){
				return;
			}
		    year=_this._getSelectValue(selectY);
		    var month=_this._getSelectValue(selectM)+1;
		    if(month>12){
		        month=1;
		        year++;
		    }
//		    if(!isYearOver(year)){
//		        return;
//		    }
		    _this._setSelectValue(selectM,month);
		    _this._setSelectValue(selectY,year);
		    _this.renderCalendar(table,year,month-1);
		});
//	    function isYearOver(year){
//	        var date=new Date();
//	        var _endYear=endYear?endYear:date.getFullYear();
//	        if(year>_endYear||year<startYear){
//	            alert("超出日期范围");
//	            return false;;
//	        }else{
//	            return true; 
//	        }
//	    }
	},
	renderCalendar:function(table,year,month){
		var url = "/bonus/bonusmovements/list.html?random=" + Math.round(Math.random() * 100);
		var param = {};
		param.yyyyMM = year+((month+1)>9?"":"0")+(month+1);
		var _this =this; 
		//判断是否可点
		if(this.max_yyyyMM){
			if((year+((month+1)>9?"":"0")+(month+1))/1>=this.max_yyyyMM/1){
				$(".year-next").addClass("disable");
			}else{
				$(".year-next").removeClass("disable");
			}
		}
		if(this.min_yyyyMM){
			if((year+((month+1)>9?"":"0")+(month+1))/1<=this.min_yyyyMM/1){
				$(".year-prev").addClass("disable");
			}else{
				$(".year-prev").removeClass("disable");
			}
		}
		_this._showCalendar(table,year,month,{});
		$.post(url, param, function(result) {
			if (result != null) {
				if (result.code == 200) {
					var data = {};
					if(result.max_yyyyMM){
						_this.max_yyyyMM =result.max_yyyyMM;
					}
					if(result.min_yyyyMM){
						_this.min_yyyyMM =result.min_yyyyMM;
					}
					if(result.data){
						for(var key in result.data){
							var _date =  new Date(result.data[key].fcreatetime);
							var day = _date.getDate();
							if(!data[day]){
								data[day]={
										record:[],
										count:0,
								}
							}
							data[day].record.push(result.data[key]);
							if(result.data[key].movementsType==1){
								data[day].count+=result.data[key].fcount;
							}else if(result.data[key].movementsType==2){
								data[day].count=result.data[key].fcount;
							}else{
								data[day].count+=result.data[key].fcount;
							}
							result.data[key].fcount = util.numFormat(result.data[key].fcount,2);
						}
						for(var day in data){
							data[day].count = util.numFormat(data[day].count,2);
						}
					}
					_this._showCalendar(table,year,month,data);
				}else{
					util.tipAlert(result.msg,"error");
				}
			}
		},"json");
		
	},
	//显示日历
	_showCalendar:function(table,year,month,data){
	    var date=new Date();
	    var _year=date.getFullYear();
	    var _month=date.getMonth();
	    var _date=date.getDate();
	    date.setYear(year);
	    date.setMonth(month);
	    date.setDate(1);
	    var day=date.getDay();
	    var _this=this;
	    var monthDays=this._getMonthDays(year,month);
//	    var td=table.getElementsByTagName('td');
	    var td=table.getElementsByTagName('tbody')[0].getElementsByTagName('td');
	    for(var k=0;k<td.length;k++){
	        td[k].innerHTML="";
	        td[k].className="";
	    }
	    for(var i=day,len=td.length;i<len;i++){
	        var _td=td[i];
	        var j=i-day+1;
	        
	        var isToday=false;
	        var dayStr=(j<10?"0":"")+j;
	        if(_year==year&&_month==month&&_date==j){
	        	isToday=true;
	        }
	        var html ='<div class="day">';
	        if(j<10){
	        	html+='0';
	        }
	        html+=j;
	        //有分红变动记录
	        if(data[j]){
	        	
                  var listhtml = '';
                  for(var key in data[j].record){
                	  var record = data[j].record[key];
                	//1增加，2减少，3结余
                	var type = '其他类目';
                	if(record.movementsType==1){
                		type ="增加";
                	}if(record.movementsType==2){
                		type ="减少";
                	}if(record.movementsType==2){
                		type ="结余";
  					}
                	listhtml += '<li class="bonusre-even"><span>'+util.dateFormat(new Date(record.fupdatetime),2)+'</span>';
                	listhtml += '<span>'+record.remark+'</span><span>'+record.fcount+'ETC</span> </li>';
                  }
                
	        	html =	'<div class="day select '+(isToday?'today':"")+'">'
	        		 +		j
	        		 +		(isToday?'<div class="fixtoday">今天</div>':"")
	        		 +		'<p class="bonusinfor">分红金额</p><p class="bonusinfor"><span class="color-fff">'+data[j].count+'</span> ETC</p><p class="bonusinfor">激励</p> '
                     +		'<div class="divbonusre-list"><ul><p class="bonusre-hti">明细</p>'
                     +			listhtml
                     +			'</ul>'
                     +		'</div>'
	        		 +	'</div>';
	        }else{
	        	html =	'<div class="day '+(isToday?'today':"")+'">'
		       		 +		j
		       		 +		(isToday?'<div class="fixtoday">今天</div>':"")
	        		 +	'</div>';
	        }
	        _td.innerHTML=html;
	        _td.className="date";
	        if(_year==year&&_month==month&&_date==j){
	            _td.className="today";
//	            _this._mouseOn(_td); 
	        }else{
//	            _this._mouseOn(_td); 
	        }
	        if(j>=monthDays){
	            break;
	        }
	    }
	},
	//返回某个月的天数
	    _getMonthDays:function(year,month){
	        var monthAry=[31,28,31,30,31,30,31,31,30,31,30,31];
	        if(year%400==0){
	            monthAry[1]=29;
	        }else{
	            if(year%4==0&&year%100!=0){
	                monthAry[1]=29;
	            }
	        }
	        return monthAry[month];
	    }
}