//credit goes to Loneliness Vis

questionaire(); // for avoiding naming issue




function questionaire() {
    var q1 = [1, "What is your gender?"];
    var q2 = [2, "What is your age?"];
    var q3 = [3, "What is your race?"];
    var q4 = [4, "What is your work position?"];
    var q5 = [5, "What % of tech professionals in each group have a mental health disorder?"]
    var op1 = ["Male", "Female", "Other"],
        an1 = [];
    var op2 = ['18-25', '26-35', '36-50', '51-75'],
        an2 = []
    var op3 = ['Asian', 'Hispanic/Black', 'White', 'Other'],
        an3 = []
    var op4 = ['Developer', 'Operations/Management', 'Support', "Designer", "Other"],
        an4 = []



    var q_1 = "<p class='smalltext' data-aos='fade-in'><b>" + q1[1] + "</b></p><form id='question" + q1[0] + "'data-aos='fade-in'><input type='radio' name='q1' value='1'>Female<br><input type='radio' name='q1' value='0'>Male<br><input type='radio' name='q1' value='2'>Other</form>";

    document.getElementById("q1").innerHTML = q_1;

    d3.select("#q1").on("change", function () {
        a1 = d3.select('input[name="q1"]:checked').property("value");
        an1.push(+a1);
        var section = 1;
        document.getElementById("q1").innerHTML = "<p class='smalltext' style='color:#404040;'>" + q1[1] + "<br><br>" + op1[a1] + "</p>"

        var q = "<p class='smalltext' data-aos='fade-in'><b>" + q2[1] + "</b></p><form id='question" + q2[0] + "'data-aos='fade-in'><input type='radio' name='q2' value=0>18-25<br><input type='radio' name='q2' value=1>26-35<br><input type='radio' name='q2' value=2>36-50<br><input type='radio' name='q2' value=3>51-75</form>"
        document.getElementById("q2").innerHTML = q;
    });

    d3.select("#q2").on("change", function () {
        a2 = d3.select('input[name="q2"]:checked').property("value");
        an2.push(+a2);
        var q = "<p class='smalltext' style='color:#404040;'>" + q2[1] + "<br><br>" + op2[a2] + "</p>"
        document.getElementById("q2").innerHTML = q;
        var q_2 = "<p class='smalltext' data-aos='fade-in'><b>" + q3[1] + "</b></p><form id='question" + q3[0] + "'data-aos='fade-in'><input type='radio' name='group-stack' value=0>Asian<br><input type='radio' name='group-stack' value=1>Hispanic/Black<br><input type='radio' name='group-stack' value=2>White<br><input type='radio' name='group-stack' value=3>Other</form>"
        document.getElementById("q3").innerHTML = q_2;
    });


    d3.select("#q3").on("change", function () {
        a3 = d3.select('input[name="group-stack"]:checked').node().value;
        an3.push(+a3);
        var q = "<p class='smalltext' style='color:#404040;'>" + q3[1] + "<br><br>" + op3[a3] + "</p>"
        document.getElementById("q3").innerHTML = q;
        var q_3 = "<p class='smalltext' data-aos='fade-in'><b>" + q4[1] + "</b></p><form id='question" + q4[0] + "'data-aos='fade-in'><input type='radio' name='group-stack' value=0>Developer<br><input type='radio' name='group-stack' value=1>Operations/Management<br><input type='radio' name='group-stack' value=2>Support<br><input type='radio' name='group-stack' value=3>Designer<br><input type='radio' name='group-stack' value=4>Other</form>"
        document.getElementById("q4").innerHTML = q_3;
    });


    d3.select("#q4").on("change", function () {
        a4 = d3.select('input[name="group-stack"]:checked').node().value;
        an4.push(+a4);
        var q_4 = "<p class='smalltext' style='color:#404040;'>" + q4[1] + "<br><br>" + op4[a4] + "</p>"
        document.getElementById("q4").innerHTML = q_4;
        var q_5 = `<p><b>${q5[1]}</b></p>`
        document.getElementById("q5").innerHTML = q_5;

        var data = [0, 1]
        var sliderVertical = d3
            .sliderLeft()
            .min(d3.min(data))
            .max(d3.max(data))
            .height(300)
            .tickFormat(d3.format('.0%'))
            .ticks(4)
            .default(0.5)
            .handle(
                d3
                  .symbol()
                  .type(d3.symbolCircle)
                  .size(200)()
              )
            .on('onchange', val => {
                d3.select('p#value-vertical').text(d3.format('.0%')(val));
            });

        var gVertical = d3
            .select('div#slider-vertical')
            .append('svg')
            .attr('width', 100)
            .attr('height', 400)
            .append('g')
            .attr('transform', 'translate(60,30)');

        gVertical.call(sliderVertical);

        d3.select('p#value-vertical').text(d3.format('.0%')(sliderVertical.value()));
    });
}