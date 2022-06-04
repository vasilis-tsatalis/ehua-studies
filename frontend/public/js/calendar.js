
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function drawCalendarMonths()
{
    for(var i = 0; i < months.length; i++)
    {
        var doc = document.createElement("div");
        doc.innerHTML = months[i];
        doc.classList.add("dropdown-item");

        doc.onclick = (function () {
            var selectedMonth = i;
            return function ()
            {
                month = selectedMonth;
                document.getElementById("curMonth").innerHTML = months[month];
                loadCalendarDays();
                return month;
            }
        })();

        document.getElementById("months").appendChild(doc);
    }
}


function loadYears()
    {
        // whichever date range makes the most sense
        var startYear = 1900;
        var endYear = 2022;

        for(var i = startYear; i <= endYear; i++)
        {
            var doc = document.createElement("div");
            doc.innerHTML = i;
            doc.classList.add("dropdown-item");

            doc.onclick = (function(){
                var selectedYear = i;
                return function(){
                    year = selectedYear;
                    document.getElementById("curYear").innerHTML = year;
                    loadCalendarDays();
                    return year;
                }
            })();

            document.getElementById("years").appendChild(doc);
        }
}


function daysInMonth(month, year)
{
    let d = new Date(year, month+1, 0);
    return d.getDate();
}

function loadCalendarDays()
{
    document.getElementById("calendarDays").innerHTML = "";

    var tmpDate = new Date(year, month, 0);
    var num = daysInMonth(month, year);
    var dayofweek = tmpDate.getDay();       // find where to start calendar day of week
        // create day prefixes
    for(var i = 0; i <= dayofweek; i++)
    {
        var d = document.createElement("div");
        d.classList.add("day");
        d.classList.add("blank");
        document.getElementById("calendarDays").appendChild(d);
    }

        // render the rest of the days
        for(var i = 0; i < num; i++)
        {
            var tmp = i + 1;
            var d = document.createElement("div");
            d.id = "calendarday_" + i;
            d.className = "day";
            d.innerHTML = tmp;
            document.getElementById("calendarDays").appendChild(d);
        }

        var clear = document.createElement("div");
        clear.className = "clear";
        document.getElementById("calendarDays").appendChild(clear);
}
 