$(() => {
    let n;
    
    n = $('.inputdata__number-input').val();

    let jCurr = n - 2; //текущее значение j
    let iCurr = 0; //текущее значение i
    let cycleStart = false;
    let iAnim;
    let blockMargin; // боковой margin у блоков
    let IsSorted = false; //сортировка окончена
    let algCounter = 0 // число операций в алгоритме
    let generateCounter = 0; // число запусков генарации


    // генерация n чисел от min до max (включительно)
    function createRandomArray(n, min, max) {
        let arr = [];
        for (let i = 0; i < n; i++) {
            arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return arr;
    }

    function randomRGB(i) {
        let R, G, B;
        if (i >= 1 && i <= 50) {
            R = Math.round((255 / 49) * (50 - i));
            G = Math.round((255 / 49) * (i - 1));;
            B = 0;
        } else {
            R = 0;
            G = Math.round((255 / 49) * (100 - i));
            B = Math.round((255 / 49) * (i - 51));

        }

        return `rgb(${R},${G},${B})`;
    }

    function randomHehRGB(i) {
        let color = (Math.round(0xFFFFFF * i / 100)).toString(16);
        if (color == '0') {
            return '#000000';
        }
        if (color.length == 5) {
            return '#0' + color;
        }
        return '#' + color;
    }

    //////////////////////////////////////////
    ///////--ФУНКЦИЯ ЦИКЛА АЛГОРИТМА--////////
    //////////////////////////////////////////
    function Cycle() {
        algCounter++;
        $('.output__counter-value').html(algCounter);
        // проверка необходимости анимации
        if (str[iCurr] > str[iCurr + 1]) { // если необходима анимация
            let widthBlock = Math.round(100 / n);
            let left0 = (iCurr * widthBlock) + '%';
            let left1 = ((iCurr + 1) * widthBlock) + '%';
            //console.log(left0);
            //console.log(left1);
            let block0 = $('.order' + iCurr);
            let block1 = $('.order' + (iCurr + 1));
            iAnim = iCurr;
            block0.css('left', left1);
            block1.css('left', left0);
            console.log(`Шаг Curr = ${iCurr}, jCurr = ${jCurr}: c анимацией`);
            console.log('анимация началась');
            //console.log('i = ' + i);
            block0.addClass('select');
            block1.addClass('select');
            block0.removeClass('order' + iCurr);
            block0.addClass('order' + (iCurr + 1));
            block1.removeClass('order' + (iCurr + 1));
            block1.addClass('order' + iCurr);

            let curr = str[iCurr];
            str[iCurr] = str[iCurr + 1];
            str[iCurr + 1] = curr;

            // обновление счетчика цикла 
            if (iCurr == jCurr && jCurr > 0) {
                iCurr = 0;
                jCurr--;
            } else {
                iCurr++;
            }

        } else { // если анимации нет
            console.log(`Шаг Curr = ${iCurr}, jCurr = ${jCurr}: без анимации`);
            // обновление счетчика цикла
            if (iCurr == jCurr) {
                iCurr = 0;
                jCurr--;
            } else {
                iCurr++;
            }

            // запуск алгоритма с новым значением счетчика
            if (jCurr >= 0) {
                Cycle();
            } else {
                IsSorted = true;
                console.log('Сортировка закончена')
                $('.output__status-value').html('sorted');
                $('.btn.generate').removeClass('disable');
                // окно ввода n активно
                $('.inputdata__number-input').prop("disabled", false);

            }

        }

    }

    ////////////////////////////////////////////
    ////////////////--GENERATE--////////////////
    ////////////////////////////////////////////
    $('.btn.generate').on('click', function () {

        if ($('.output__status-value').html() !== 'sort in progress') {
            generateCounter++;

            // обнуляем счетчик операций и выводим его
            algCounter = 0;
            $('.output__counter-value').html(algCounter);

            //обновляем статус - отсортировано
            $('.output__status-value').html('generated');
            $('.btn.sort').removeClass('disable');

            if (IsSorted) {
                $('.btn.sort').removeClass('disable');

                $('.block').css('transition', '1000ms');
                // запускаем анимацию перемещения блоков в пероначальное состояние
                // затем анимацию схлопывания по высоте
                for (let i = 0; i < n; i++) {
                    let leftI = (Math.round(100 / n) * i).toFixed(2) + "%";
                    $(`.block${i}`).css("left", leftI).css('height', '0');
                }
                $('.block0').addClass('reverse-replace'); // добавления класса-маркера анимации
            }

            IsSorted = false;

            str = createRandomArray(n, 1, 100);
            jCurr = n - 2; //текущее значение j
            iCurr = 0; //текущее значение i
            cycleStart = false;

            // создание блоков
            // блоки создаются только один раз в начале, 
            // когда generateCounter = 1
            if (generateCounter == 1) {
                // создаем
                for (let i = 0; i < n; i++) {
                    $('.blocks').append(`<div class="block block${i} order${i}"></div>`);
                }
                $('.block').append('<div class="block-number"></div>');

                // стилизация блоков
                // ширина контента блока в %
                blockMargin = parseInt($(`.block`).css('margin-left'));

                let wString = ((1090 / n) - 2 * blockMargin) * (100 / 1090) + "%";
                let www = (1 * ((1090 / n) - 2 * blockMargin) / 1).toFixed(2)

                for (let i = 0; i < n; i++) {
                    $(`.block${i}`).css("width", wString);
                    let leftI = (100 / n) * i + "%";
                    $(`.block${i}`).css("left", leftI);
                }

            }

            // цифра, высота, цвет
            $('.block-number').each(function (index) {
                $(this).html(str[index]);
            });
            $('.block').each(function (index, elem) {
                $(this).innerHeight(300 * str[index] / 100);
                let color = randomRGB(str[index]); //randomHehRGB(str[index])
                $(this).css('background-color', color);
            });
        }



    });

    $('.btn.generate').click();

    console.log($('.block1'));

    //////////////////////////////////////////
    ///////--ОБРАБОТКА КОНЦА АНИМАЦИЙ--///////
    //////////////////////////////////////////
    $('.block').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        console.log('анимация закончилась');

        // если анимация обратного размещения завершена
        // запускаем анимацию схлопывания высоты
        if ($(this).hasClass('reverse-replace')) {
            $('.block').innerHeight(0);
            $('.block0').removeClass('reverse-replace');
            $('.block0').addClass('height-collapse');
        }

        // если анимация схлопывания высоты завершена
        if ($(this).hasClass('height-collapse')) {
            // переписываем классы у всех блоков 
            $('.block').removeClass().each(function (index) {
                $(this).addClass(`block block${index} order${index}`);
            });

            // заново стилизуем (высота, цифра и цвет)
            // без создания заново, т.к. generateCounter будет > 1
            $('.btn.generate').click();

        }

        if (cycleStart) {

            if ($(this).hasClass('order' + iAnim)) {
                console.log('анимация закончилась');
                $('.order' + iAnim).removeClass('select');
                $('.order' + (iAnim + 1)).removeClass('select');
                //console.log(`iCurr = ${iCurr}, jCurr = ${jCurr}`);
                if (jCurr >= 0) {
                    Cycle();
                } else {
                    IsSorted = true;
                    console.log('Сортировка закончена');
                    $('.inputdata__number-input').removeClass('disable');
                    $('.output__status-value').html('sorted');
                    $('.btn.generate').removeClass('disable');
                }
            }
        }

    });

    ////////////////////////////////////////////
    //////////////////--SORT--/////////////////
    ////////////////////////////////////////////
    $('.btn.sort').on('click', function () {

        if ($('.output__status-value').html() == 'generated') {
            // окно ввода n неактивно
            $('.inputdata__number-input').prop("disabled", true);
            $('.inputdata__number-input').addClass('disable');
            cycleStart = true;
            let v = $('.inputdata__speed-value').html();
            $('.block').css('transition', v + 'ms');
            console.log('cycleStart = ' + cycleStart);
            Cycle(iCurr, jCurr);
            $('.output__status-value').html('sort in progress');
            $('.btn.sort').addClass('disable');
            $('.btn.generate').addClass('disable');
            //console.log(`n = ${n}`);
        }

    });

    /////////////////////////////////////////
    ////////////--ВВОД ЧИСЛА ЭЛЕМЕНТОВ--/////
    /////////////////////////////////////////
    $('.inputdata__number-input').on('change', function () {
        //console.log($(this).val());

        let inputN = $(this).val();

        if (/\D/i.test(inputN)) {
            alert('Not a number!');
        } else {
            nNew = +inputN;
        };

        // если nNew < n
        if (nNew < n) {
            // лишние блоки - схлопнуть по высоте, 
            // а потом удалить
            // и расширить оставшиеся блоки 
            for (let i = nNew; i < n; i++) {
                $(`.block${i}`).animate({
                    'height': '0'
                }, 1000, function () { //лишние блоки - схлопнуть по высоте,
                    $(`.block${i}`).remove(); // а потом удалить

                    // и расширить оставшиеся блоки и заново сгенерировать высоту и цвет
                    str = createRandomArray(n, 1, 100);
                    blockMargin = parseInt($(`.block`).css('margin-left'));
                    let wString = ((1090 / nNew) - 2 * blockMargin) * (100 / 1090) + "%";

                    // цифра, высота, цвет
                    $('.block-number').each(function (index) {
                        $(this).html(str[index]);
                    });
                    $('.block').each(function (index, elem) {
                        $(this).innerHeight(300 * str[index] / 100);
                        let color = randomRGB(str[index]); //randomHehRGB(str[index])
                        $(this).css('background-color', color);

                        let leftI = (100 / nNew) * index + "%";
                        $(this).css("width", wString);
                        $(this).css("left", leftI);
                    });

                    n = nNew;

                });


            }
        }

        // если nNew > n
        if (nNew > n) {
            // если отсортированы вернуть в исходное состояние с новой, уменьшенной шириной
            // затем добавить дополнительные блоки
            if ($('.output__status-value').html() == 'sorted') {
                console.log('tttt');
                let wStringNew = ((1090 / nNew) - 2 * blockMargin) * (100 / 1090) + "%";

                // убираем CSS анимацию чтобы плавно менялось только через animate
                $('.block').css('transition', 0 + 'ms');


                $('.block').each(function (index) {

                    $(this).animate({
                        "width": wStringNew,
                        "left": (100 / nNew) * index + "%"
                    }, 1000, function () {
                        // возвращаем CSS анимацию
                        let v = $('.inputdata__speed-value').html();
                        $('.block').css('transition', v + 'ms');



                        if (index == 0) { // делать только одни раз, а не для всех (при i = 0)
                            console.log('fffffff');

                            // затем добавить дополнительные блоки
                            for (let i = n; i < nNew; i++) {
                                $('.blocks').append(`<div class="block block${i} order${i}"></div>`);
                                $('.block').last().append('<div class="block-number"></div>');
                            }
                            

                            // всем вместе - заново задаем высоту, цвет и цифру
                            n = nNew;
                            str = createRandomArray(n, 1, 100);
                            blockMargin = parseInt($(`.block`).css('margin-left'));
                            let wString = ((1090 / n) - 2 * blockMargin) * (100 / 1090) + "%";
                            $('.block-number').each(function (index) {
                                $(this).html(str[index]);
                            });
                            $('.block').each(function (index) {
                                $(this).innerHeight(300 * str[index] / 100);
                                let color = randomRGB(str[index]); //randomHehRGB(str[index])
                                $(this).css('background-color', color);

                                let leftI = (100 / n) * index + "%";
                                $(this).css("width", wString);
                                $(this).css("left", leftI);

                            });





                        }
                    });

                })


                /* function () {


                    // затем добавить дополнительные блоки

                    for (let i = n; i < nNew; i++) {
                        $('.blocks').append(`<div class="block block${i} order${i}"></div>`);
                    }
                    $('.block').append('<div class="block-number"></div>');

                    // всем вместе - заново задаем высоту, цвет и цифру

                    n = nNew;
                    str = createRandomArray(n, 1, 100);
                    blockMargin = parseInt($(`.block`).css('margin-left'));
                    let wString = ((1090 / n) - 2 * blockMargin) * (100 / 1090) + "%";
                    $('.block-number').each(function (index) {
                        $(this).html(str[index]);
                    });
                    $('.block').each(function (index) {
                        $(this).innerHeight(300 * str[index] / 100);
                        let color = randomRGB(str[index]); //randomHehRGB(str[index])
                        $(this).css('background-color', color);

                        let leftI = (100 / n) * index + "%";
                        $(this).css("width", wString);
                        $(this).css("left", leftI);

                    });
                } */


                /* for (let i = 0; i < n; i++) {
                    $(`.block${i}`).css("width", wString);
                    let leftI = (100 / n) * i + "%";
                    $(`.block${i}`).css("left", leftI);
                } */
            }

        }





    });

    /////////////////////////////////////////
    ///////--ВВОД СКОРОСТИ АНИМАЦИИ--////////
    /////////////////////////////////////////
    $('.inputdata__speed-up').on('click', function () {
        let v = $('.inputdata__speed-value').text();
        $('.inputdata__speed-value').text(+v + 50 + '');
        $('.block').css('transition', +v + 50 + 'ms');
        $('.inputdata__speed-down').removeClass('disable');
    });

    $('.inputdata__speed-down').on('click', function () {
        let v = $('.inputdata__speed-value').text();
        if (+v > 50) {
            $('.inputdata__speed-value').text(+v - 50 + '');
            $('.block').css('transition', +v - 50 + 'ms');
        }

        if (+v == 100) {
            $('.inputdata__speed-down').addClass('disable');
        }
    });

    let SpeedValueHover = false;

    $('.inputdata__speed-value').hover(() => {
        SpeedValueHover = true;
        console.log(SpeedValueHover);
    }, () => {
        SpeedValueHover = false;
        console.log(SpeedValueHover);
    });



})