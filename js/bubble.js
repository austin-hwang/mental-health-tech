class BubbleChart {
    constructor(parentElement, surveyData, phaseData, myEventHandler) {
        this.parentElement = parentElement;
        this.surveyData = surveyData;
        this.phaseData = phaseData;
        this.myEventHandler = myEventHandler;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40
        };

        // Harcoded so that particles don't fly around
        vis.width = 538.078;
        vis.height = 616.797;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.paths = {
            e: "M58.65,22.876h-0.006l0,0h-4.144c2.98-1.611,5.029-4.726,5.029-8.352C59.53,9.265,55.261,5,50,5s-9.53,4.265-9.53,9.524  c0,3.626,2.049,6.74,5.029,8.352H41.35c-3.885,0-7.026,3.142-7.026,7.032v23.573c0,2.97,2.405,5.364,5.375,5.364v30.79  c0,2.959,2.405,5.364,5.363,5.364h10.51c2.97,0,5.375-2.405,5.375-5.364V58.713c2.653-0.327,4.73-2.491,4.73-5.231V29.908  C65.677,26.018,62.523,22.876,58.65,22.876z"
        }
        vis.colorScale = {
            "M": '#fff9c4',
            "F": 'lightblue',
            "Other-Gender": '#B19CD9',
            "18-25": '#fff9c4',
            "26-35": 'lightblue',
            "36-50": '#B19CD9',
            "51-75": '#8bc34a',
            "White": '#fff9c4',
            "Asian": 'lightblue',
            "Hispanic-Black": '#B19CD9',
            "Other-Race": '#8bc34a',
            "dev": '#fff9c4',
            "mgmt": 'lightblue',
            "other_job": '#B19CD9',
            "support": '#8bc34a',
            "designer": "#ffb86c"
        };
        vis.stepNames = ["start", "gender", "age", "race", "occupation"];
        vis.step = 0;

        let scroll = scroller().container(d3.select('#floatingarea'));
        scroll(d3.selectAll('.step'));
        scroll.on('active', function (index) {
            d3.selectAll('.step')
                .style('opacity', function (d, i) {
                    return i === index ? 1 : 0;
                });
            vis.step = index;
            d3.selectAll(`.circle-bubble`)
                .style('fill', d => vis.updateColors(d));
            vis.updateVis();
        })

        vis.xCenter = {
            "M": 2 * vis.width / 10,
            "F": 6 * vis.width / 10,
            "Other-Gender": 9 * vis.width / 10,
            "18-25": 3 * vis.width / 10,
            "26-35": 8 * vis.width / 10,
            "36-50": 2 * vis.width / 10,
            "51-75": 7 * vis.width / 10,
            "White": 4 * vis.width / 10,
            "Asian": 7 * vis.width / 10,
            "Hispanic-Black": 7 * vis.width / 10,
            "Other-Race": 8 * vis.width / 10,
            "dev": vis.width / 2,
            "mgmt": 8 * vis.width / 10,
            "other_job": 2 * vis.width / 10,
            "support": 8 * vis.width / 10,
            "designer": 2 * vis.width / 10

        };
        vis.yCenter = {
            "M": vis.height / 3,
            "F": 6 * vis.height / 10,
            "Other-Gender": 4 * vis.height / 5,
            "18-25": 2 * vis.height / 5,
            "26-35": 2 * vis.height / 5,
            "36-50": 4 * vis.height / 5,
            "51-75": 4 * vis.height / 5,
            "White": vis.height / 2,
            "Asian": 3 * vis.height / 10,
            "Hispanic-Black": 7 * vis.height / 10,
            "Other-Race": vis.height / 2,
            "dev": vis.height / 2,
            "mgmt": 3 * vis.height / 10,
            "other_job": 7 * vis.height / 10,
            "support": 7 * vis.height / 10,
            "designer": 3 * vis.height / 10
        }

        let labelWidth = 538.078;
        let labelHeight = 616.797;

        vis.bubbleLabels = {
            "start": [{
                label: "Total (each icon represents 10 people)",
                xPos: labelWidth / 2,
                yPos: labelHeight / 2 + 100
            }],
            "gender": [{
                    label: "Male",
                    xPos: 2 * labelWidth / 10,
                    yPos: labelHeight / 3 + 170,
                },
                {
                    label: "Female",
                    xPos: 6 * labelWidth / 10 - 10,
                    yPos: 6 * labelHeight / 10 + 120,
                },
                {
                    label: "Other",
                    xPos: 9 * labelWidth / 10 - 5,
                    yPos: 4 * labelHeight / 5 + 60
                },
                {
                    label: "By Gender",
                    xPos: labelWidth / 2,
                    yPos: labelHeight / 6 - 20
                }
            ],
            "age": [{
                    label: "18-25",
                    xPos: 3 * labelWidth / 10 + 10,
                    yPos: 2 * labelHeight / 5 + 100
                },
                {
                    label: "26-35",
                    xPos: 8 * labelWidth / 10,
                    yPos: 2 * labelHeight / 5 + 150
                },
                {
                    label: "36-50",
                    xPos: 2 * labelWidth / 10,
                    yPos: 4 * labelHeight / 5 + 120
                },
                {
                    label: "51-75",
                    xPos: 7 * labelWidth / 10,
                    yPos: 4 * labelHeight / 5 + 75
                },
                {
                    label: "By Age Group (yrs)",
                    xPos: labelWidth / 2,
                    yPos: labelHeight / 6
                }
            ],
            "race": [{
                    label: "White",
                    xPos: 4 * labelWidth / 10,
                    yPos: labelHeight / 2 + 118
                },
                {
                    label: "Asian",
                    xPos: 7 * labelWidth / 10 - 10,
                    yPos: 3 * labelHeight / 10 + 55
                },
                {
                    label: "Hispanic/Black",
                    xPos: 7 * labelWidth / 10,
                    yPos: 7 * labelHeight / 10 + 45
                },
                {
                    label: "Other",
                    xPos: 8 * labelWidth / 10 - 10,
                    yPos: labelHeight / 2 + 55
                },
                {
                    label: "By Race",
                    xPos: labelWidth / 2,
                    yPos: labelHeight / 6
                }
            ],
            "occupation": [{
                    label: "Developers",
                    xPos: labelWidth / 2,
                    yPos: labelHeight / 2 + 118
                },
                {
                    label: "Management",
                    xPos: 8 * labelWidth / 10,
                    yPos: 2 * labelHeight / 10 + 155
                },
                {
                    label: "Other",
                    xPos: 2 * labelWidth / 10 + 10,
                    yPos: 8 * labelHeight / 10 + 30
                },
                {
                    label: "Support",
                    xPos: 8 * labelWidth / 10,
                    yPos: 8 * labelHeight / 10 + 30
                },
                {
                    label: "Designer",
                    xPos: 2 * labelWidth / 10 + 10,
                    yPos: 3 * labelHeight / 10 + 80
                },
                {
                    label: "By Occupation",
                    xPos: labelWidth / 2,
                    yPos: labelHeight / 6
                }
            ]
        }

        vis.hoverData = {
            0: [{
                label: "Total",
                xPos: labelWidth / 2 + 5,
                yPos: labelHeight / 3 + 5,
                radius: 160,
            }],
            1: [{
                    label: "M",
                    xPos: 2 * labelWidth / 10 + 13,
                    yPos: labelHeight / 3 + 13,
                    radius: 135
                },
                {
                    label: "F",
                    xPos: 6 * labelWidth / 10 - 5,
                    yPos: 6 * labelHeight / 10,
                    radius: 90
                },
                {
                    label: "Other-Gender",
                    xPos: 9 * labelWidth / 10 - 5,
                    yPos: 4 * labelHeight / 5 - 5,
                    radius: 40
                },
            ],
            2: [{
                    label: "18-25",
                    xPos: 3 * labelWidth / 10 + 15,
                    yPos: 2 * labelHeight / 5 + 15,
                    radius: 60
                },
                {
                    label: "26-35",
                    xPos: 8 * labelWidth / 10,
                    yPos: 2 * labelHeight / 5 + 10,
                    radius: 110
                },
                {
                    label: "36-50",
                    xPos: 2 * labelWidth / 10 + 15,
                    yPos: 4 * labelHeight / 5,
                    radius: 100
                },
                {
                    label: "51-75",
                    xPos: 7 * labelWidth / 10,
                    yPos: 4 * labelHeight / 5 - 8,
                    radius: 40
                },
            ],
            3: [{
                    label: "White",
                    xPos: 4 * labelWidth / 10,
                    yPos: labelHeight / 2,
                    radius: 95
                },
                {
                    label: "Asian",
                    xPos: 7 * labelWidth / 10 - 8,
                    yPos: 3 * labelHeight / 10 + 10,
                    radius: 25
                },
                {
                    label: "Hispanic-Black",
                    xPos: 7 * labelWidth / 10 - 2,
                    yPos: 7 * labelHeight / 10 - 5,
                    radius: 25
                },
                {
                    label: "Other-Race",
                    xPos: 8 * labelWidth / 10 - 8,
                    yPos: labelHeight / 2,
                    radius: 25
                },
            ],
            4: [{
                    label: "dev",
                    xPos: labelWidth / 2 + 5,
                    yPos: labelHeight / 2 + 5,
                    radius: 95
                },
                {
                    label: "mgmt",
                    xPos: 8 * labelWidth / 10 - 5,
                    yPos: 3 * labelHeight / 10 + 10,
                    radius: 65
                },
                {
                    label: "other_job",
                    xPos: 2 * labelWidth / 10 + 17,
                    yPos: 7 * labelHeight / 10,
                    radius: 70
                },
                {
                    label: "support",
                    xPos: 8 * labelWidth / 10 - 5,
                    yPos: 7 * labelHeight / 10 - 5,
                    radius: 70
                },
                {
                    label: "designer",
                    xPos: 2 * labelWidth / 10 + 18,
                    yPos: 3 * labelHeight / 10 + 13,
                    radius: 50
                },
            ]
        }
    }

    updateColors(d) {
        let vis = this;
        if (vis.stepNames[vis.step] === "start") {
            if (d["gender"][1]) {
                return "#ff5555";
            } else {
                return "lightblue"
            }
        } else if (vis.stepNames[vis.step] === "race" || vis.stepNames[vis.step] === "occupation") {
            if (!d[vis.stepNames[vis.step]]) {
                return "none";
            } else if (d[vis.stepNames[vis.step]][1]) {
                return "#ff5555";
            } else {
                return vis.colorScale[d[vis.stepNames[vis.step]][0]];
            }
        } else {
            if (d[vis.stepNames[vis.step]][1]) {
                return "#ff5555";
            } else {
                return vis.colorScale[d[vis.stepNames[vis.step]][0]];
            }
        }
    }

    wrangleData() {
        let vis = this;

        vis.nodes = []
        let counts = {
            "gender": {
                "M": {
                    total: 0,
                    numDisorder: 0,
                },
                "F": {
                    total: 0,
                    numDisorder: 0,
                },
                "Other-Gender": {
                    total: 0,
                    numDisorder: 0,
                },
            },
            "age": {
                "18-25": {
                    total: 0,
                    numDisorder: 0,
                },
                "26-35": {
                    total: 0,
                    numDisorder: 0
                },
                "36-50": {
                    total: 0,
                    numDisorder: 0,
                },
                "51-75": {
                    total: 0,
                    numDisorder: 0,
                }
            },
            "race": {
                "White": {
                    total: 0,
                    numDisorder: 0,
                },
                "Asian": {
                    total: 0,
                    numDisorder: 0
                },
                "Hispanic-Black": {
                    total: 0,
                    numDisorder: 0
                },
                "Other-Race": {
                    total: 0,
                    numDisorder: 0
                }
            },
            "occupation": {
                "dev": {
                    total: 0,
                    numDisorder: 0,
                },
                "mgmt": {
                    total: 0,
                    numDisorder: 0,
                },
                "other_job": {
                    total: 0,
                    numDisorder: 0,
                },
                "support": {
                    total: 0,
                    numDisorder: 0
                },
                "designer": {
                    total: 0,
                    numDisorder: 0
                }
            }
        }

        vis.surveyData.forEach((el, i) => {
            let disorder = true ? el.disorder === "Yes" : false;
            if (counts["gender"][el.gender]) {
                counts["gender"][el.gender].total += 1;
                counts["gender"][el.gender].numDisorder += disorder;
            } else {
                counts["gender"]["Other-Gender"].total += 1;
                counts["gender"]["Other-Gender"].numDisorder += disorder;
            }
            if (counts["race"][el.race]) {
                counts["race"][el.race].total += 1;
                counts["race"][el.race].numDisorder += disorder;
            } else if (el.race === "Hispanic" || el.race === "Black or African American") {
                counts["race"]["Hispanic-Black"].total += 1;
                counts["race"]["Hispanic-Black"].numDisorder += disorder;
            } else if (el.race === "More than one of the above") {
                counts["race"]["Other-Race"].total += 1;
                counts["race"]["Other-Race"].numDisorder += disorder;
            }


            if (el.age >= 18 && el.age <= 25) {
                counts["age"]["18-25"].total += 1;
                counts["age"]["18-25"].numDisorder += disorder;
            } else if (el.age >= 26 && el.age <= 35) {
                counts["age"]["26-35"].total += 1;
                counts["age"]["26-35"].numDisorder += disorder;
            } else if (el.age >= 36 && el.age <= 50) {
                counts["age"]["36-50"].total += 1;
                counts["age"]["36-50"].numDisorder += disorder;
            } else {
                counts["age"]["51-75"].total += 1;
                counts["age"]["51-75"].numDisorder += disorder;
            }

            counts["occupation"]["dev"].total += parseInt(el["dev"]);
            counts["occupation"]["dev"].numDisorder += disorder * parseInt(el["dev"]);

            counts["occupation"]["mgmt"].total += parseInt(el["mgmt"]);
            counts["occupation"]["mgmt"].numDisorder += disorder * parseInt(el["mgmt"]);

            counts["occupation"]["other_job"].total += parseInt(el["other_job"]);
            counts["occupation"]["other_job"].numDisorder += disorder * parseInt(el["other_job"]);

            counts["occupation"]["support"].total += parseInt(el["support"]);
            counts["occupation"]["support"].numDisorder += disorder * parseInt(el["support"]);

            counts["occupation"]["designer"].total += parseInt(el["designer"]);
            counts["occupation"]["designer"].numDisorder += disorder * parseInt(el["designer"]);
        })

        let categoryKeys = Object.keys(counts);
        for (const key of categoryKeys) {
            let subcateogryKeys = Object.keys(counts[key]);
            for (const subkey of subcateogryKeys) {
                if (subkey === "Hispanic-Black") {
                    counts[key][subkey].total = Math.ceil(counts[key][subkey].total / 10) + 1
                    counts[key][subkey].numDisorder = Math.ceil(counts[key][subkey].numDisorder / 10);
                } else {
                    counts[key][subkey].total = Math.round(counts[key][subkey].total / 10)
                    counts[key][subkey].numDisorder = Math.round(counts[key][subkey].numDisorder / 10);
                }
            }
        }

        vis.nodes = d3.range(296).map(function (d, i) {
            return {

            }
        });

        let copyCounts = {
            ...counts
        };
        vis.nodes.forEach(el => {
            for (const key of categoryKeys) {
                let subcateogryKeys = Object.keys(copyCounts[key]);
                for (const subkey of subcateogryKeys) {
                    if (copyCounts[key][subkey].total > 0) {
                        let hasDisorder = false;
                        if (copyCounts[key][subkey].numDisorder > 0) {
                            hasDisorder = true;
                            copyCounts[key][subkey].numDisorder--;
                        }
                        el[key] = [subkey, hasDisorder];
                        copyCounts[key][subkey].total--;
                        break;
                    }
                }
            }
        })

        this.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.texts = vis.svg.selectAll(".bubble-label")
            .data(vis.bubbleLabels[vis.stepNames[vis.step]]);

        vis.texts.enter()
            .append("text")
            .attr("class", "bubble-label")
            .merge(vis.texts)
            .transition()
            .duration(1000)
            .style('fill', '#ececec')
            .attr("x", d => d.xPos)
            .attr("y", d => d.yPos)
            .text(d => d.label)
            .style("text-anchor", "middle")
            .style("font-size", "20px")

        vis.texts.exit().remove();

        let circles = vis.svg.selectAll('.circle-bubble')
            .data(vis.phaseData[vis.step]);

        circles.enter()
            .append('path')
            // .attr('r', 6)
            .merge(circles)
            .transition()
            .duration(1000)
            .attr('class', function (d) {
                let className = `circle-bubble circle-${d["age"][0]} circle-${d["gender"][0]}`;
                if (d["race"]) {
                    className += ` circle-${d["race"][0]}`;
                }
                if (d["occupation"]) {
                    className += ` circle-${d["occupation"][0]}`
                }
                return className;
            })
            .attr("d", vis.paths.e)
            .attr('fill', d => vis.updateColors(d))
            .attr("transform", function (d) {
                return `translate(${d.x},${d.y}) scale(0.15)`
            })

        circles.exit().remove();


        vis.hoverCircles = vis.svg.selectAll(".hover-circle")
            .data(vis.hoverData[vis.step])

        vis.hoverCircles.enter()
            .append("circle")
            .on('mouseover', highlight)
            .on('mouseout', dehighlight)
            .merge(vis.hoverCircles)
            .transition()
            .duration(1000)
            .attr("r", d => d.radius)
            .attr("class", "hover-circle")
            .attr("fill", "grey")
            .attr("cx", d => d.xPos)
            .attr("cy", d => d.yPos)
            .attr("opacity", 0.1)
            .attr('pointer-events', 'all');


        vis.hoverCircles.exit().remove();

        let groups = {
            "gender": ["M", "F", "Other-Gender"],
            "age": ["18-25", "26-35", "36-50", "51-75"],
            "race": ["White", "Asian", "Hispanic-Black", "Other-Race"],
            "occupation": ["dev", "mgmt", "other_job", "support", "designer"]
        }


        function highlight(e, d) {
            if (vis.step !== 0) {
                let categories = groups[vis.stepNames[vis.step]].filter(el => el !== d.label);
                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`)
                        .style('fill', 'grey')
                        .style('opacity', .3)
                }
            }

            $('html, body').animate({
                scrollTop: $(`#step${vis.step+1}`).offset().top - 90
            }, 1000);

            $('body').addClass('stop-scrolling');
            $(vis.myEventHandler).trigger("bubbleHovered", d.label);
        }

        function dehighlight(e, d) {
            if (vis.step !== 0) {
                let categories = groups[vis.stepNames[vis.step]].filter(el => el != d.label);

                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`).style('fill', function (d) {
                            if (d[vis.stepNames[vis.step]][1]) {
                                return '#ff5555';
                            } else {
                                return vis.colorScale[d[vis.stepNames[vis.step]][0]]
                            }
                        })
                        .style('opacity', 1);
                }
            }
            if (vis.step == 0) {
                $(`#step${vis.step+1}`).html(`<h5><br><cyan>41% of all respondents</cyan> said they are struggling with mental health issues.</h5><h6><lime>Hover</lime> to see what mental health disorders they are struggling with.</h6>`);
            } else if (vis.step == 1) {
                $(`#step${vis.step+1}`).html(`<h5>A <strong>higher proportion</strong> of people who identified as <cyan>Females</cyan> and <purple>Other</purple> are struggling with mental health issues, compared to Males.</h5><h6><br>Each <span
                style="color: #ff5555"><strong>red</strong></span> icon represents 10 people struggling with a mental health issue or
            disorder. <lime>Hover</lime> to see what mental health disorders each group is struggling with.</h6>`);
            } else if (vis.step == 2) {
                $(`#step${vis.step+1}`).html(`<h5>People age <yellow>18-25</yellow> and <cyan>26-35</cyan> reported the highest proportion of mental health issues.</h5><h6><br>Each <span
                style="color: #ff5555"><strong>red</strong></span> icon represents 10 people struggling with a mental health issue or
            disorder. <lime>Hover</lime> to see what mental health disorders each group is struggling with.</h6>`);
            } else if (vis.step == 3) {
                $(`#step${vis.step+1}`).html(`<h5>People who identified as <purple>Hispanic/Black</purple> reported the highest proportion of mental health issues. <cyan>Asians</cyan> had the lowest proportion.</h5><h6><br>NOTE: Disclosing race was not requested in 2016. Some participants in 2017-2019 also chose not to disclose race.</h6><h6><br>Each <span
                style="color: #ff5555"><strong>red</strong></span> icon represents 10 people struggling with a mental health issue or
            disorder. <lime>Hover</lime> to see what mental health disorders each group is struggling with.</h6>`);
            } else {
                $(`#step${vis.step+1}`).html(`<h5><orange>Designers</orange> had the highest proportion of mental health issues.<yellow>Developers</yellow> had the lowest proportion.</h5><h6><br>NOTE: Disclosing occupation was only requested in 2016.</h6><h6><br>Each <span
                style="color: #ff5555"><strong>red</strong></span> icon represents 10 people struggling with a mental health issue or
            disorder. <lime>Hover</lime> to see what mental health disorders each group is struggling with.</h6>`);
            }

            $('body').removeClass('stop-scrolling');

        }
    }

    runSimulation() {
        let vis = this;
        var simulation = d3.forceSimulation(vis.nodes)
            .force('charge', d3.forceManyBody().strength(2))
            .force('x', d3.forceX().x(function (d) {
                if (vis.stepNames[vis.step] === "race" || vis.stepNames[vis.step] === "occupation") {
                    if (!d[vis.stepNames[vis.step]]) {
                        return 0;
                    } else {
                        return vis.xCenter[d[vis.stepNames[vis.step]][0]];
                    }
                } else {
                    return vis.stepNames[vis.step] !== "start" ? vis.xCenter[d[vis.stepNames[vis.step]][0]] : vis.width / 2;
                }
            }))
            .force('y', d3.forceY().y(function (d) {
                if (vis.stepNames[vis.step] === "race" || vis.stepNames[vis.step] === "occupation") {
                    if (!d[vis.stepNames[vis.step]]) {
                        return 0;
                    } else {
                        return vis.yCenter[d[vis.stepNames[vis.step]][0]];
                    }
                } else {
                    return vis.stepNames[vis.step] !== "start" ? vis.yCenter[d[vis.stepNames[vis.step]][0]] : 1 * vis.height / 3;
                }
            }))
            .force('collision', d3.forceCollide().radius(8).iterations(7))
            .on('tick', ticked);

        function ticked() {
            let circles = vis.svg.selectAll('.circle-bubble')
                .data(vis.nodes);

            circles.enter()
                .append('path')
                // .attr('r', 6)
                .merge(circles)
                .attr('class', function (d) {
                    let className = `circle-bubble circle-${d["age"][0]} circle-${d["gender"][0]}`;
                    if (d["race"]) {
                        className += ` circle-${d["race"][0]}`;
                    }
                    if (d["occupation"]) {
                        className += ` circle-${d["occupation"][0]}`
                    }
                    return className;
                })
                .attr("d", vis.paths.e)
                .attr('fill', d => vis.updateColors(d))
                .attr("transform", function (d) {
                    return `translate(${d.x},${d.y}) scale(0.15)`
                })
            // .attr('cx', function (d) {
            //     return d.x;
            // })
            // .attr('cy', function (d) {
            //     return d.y;
            // });

            circles.on('mouseover', highlight)
                .on('mouseout', dehighlight);

            let groups = {
                "gender": ["M", "F", "Other-Gender"],
                "age": ["18-25", "26-35", "36-50", "51-75"],
                "race": ["White", "Asian", "Hispanic-Black", "Other-Race"],
                "occupation": ["dev", "mgmt", "other_job", "support", "designer"]
            }

            function highlight(e, d) {
                let categories = groups[vis.stepNames[vis.step]].filter(el => el != d[vis.stepNames[vis.step]][0]);

                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`)
                        .style('fill', 'grey')
                        .style('opacity', .3)
                }
            }

            function dehighlight(e, d) {
                let categories = groups[vis.stepNames[vis.step]].filter(el => el != d[vis.stepNames[vis.step]][0]);

                for (const category of categories) {
                    d3.selectAll(`.circle-${category}`).style('fill', function (d) {
                            if (d[vis.stepNames[vis.step]][1]) {
                                return 'red';
                            } else {
                                return vis.colorScale[d[vis.stepNames[vis.step]][0]]
                            }
                        })
                        .style('opacity', 1);
                }
            }
            circles.exit().remove();
        }
    }
}