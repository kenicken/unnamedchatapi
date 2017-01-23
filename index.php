<html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<script type="text/javascript" src="scripts/JS/utility.js"></script>
<body>
    
    <p style='text-align: center;'> Local Test Object List [Orilla]  </p>
    <hr>
    <p id='date' style='text-align: center'></p>
    
        <table style='margin-left: auto; margin-right: auto'>
            <ol>
            <tr><td><li> <a href='task1/uploadtester.html'> Object uploading protocol [PHP]  </a></td><td><i>Last update: Unknown</i></td></li></tr>
            <tr><td><li> <a href='task2/login.html'> Messenger </a></td><td><i>Last update: August 17, 2013</i></td></li></tr>
            <tr><td><li> <a href='task2ext/login.html'> Messenger [toolbar] </a></td><td><i>Last update: August 16, 2013</i></td></li></tr>
            <tr><td><li> <a href='task3/'> PDF Viewer </a></td><td><i>Last update: April 23, 2013</i></td></li></tr>
            <tr><td><li> <a href='task4/login.html'> File Manager </a></td><td><i>Last update: June 6, 2013</i></td></li></tr>
            <tr><td><li> <a href='task5/graph.html'> Graph Manager </a></td><td><i>Last update: September 8, 2013</i></td></li></tr>
            </ol>
        
    <tr style='height: 50px;'></tr>

    <tr><td colspan=2><center> Utilities </center></td></tr>
            <ol>
            <tr><td><li> <a href='util/'> Account Manager  </a></td><td><i>Last update: July 26, 2013</i></td></li></tr>
            </ol>
    </table>

    <center>
    <br><br><br><p>Change Log</p>
    <iframe src="changelog.html">
    </iframe>
    </center>
</body>
<script>

    var clock = function() {

        get_e('date').innerHTML = "Today is " + Date_str() + "<br>base on your computer time.";
        setTimeout('clock()', 1000);
    }
    clock();
</script>
</html>