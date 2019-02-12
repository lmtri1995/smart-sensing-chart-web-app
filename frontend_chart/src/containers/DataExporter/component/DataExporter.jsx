import React, {Component} from 'react';
import Excel from './../../../../node_modules/exceljs/dist/es5/exceljs.browser';
import * as FileSaver from 'file-saver';
import {standardDeviation} from "../../../shared/utils/dataCalculator";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import {DashboardContainerID, ExportType} from "../../../constants/constants";

export default class DataExporter extends Component {

    exportExcelFile(data) {
        // Create new Workbook
        let workbook = new Excel.Workbook();
        workbook.creator = 'trile@snaglobal.net';
        workbook.lastModifiedBy = 'trile@snaglobal.net';
        workbook.created = new Date();
        workbook.modified = new Date();

        // Add new Worksheet
        let worksheet = workbook.addWorksheet('Smart_Sensing_Chart_Data');

        // ---------- Draw borders and define text alignments for every cell of the table ----------
        let middleLeftAlignment = {vertical: 'middle', horizontal: 'left'};
        let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
        // 2: 2 first rows for Processing Status section
        // data.length: number of stations
        // 6: 6 rows for Total section
        for (let row = 1; row <= 2 + data.length + 6; ++row) {  // Number of rows

            let currentRow = worksheet.getRow(row);

            for (let col = 1; col <= 7; ++col) {  // Number of columns
                currentRow.getCell(col).border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                };
                // Station [num] cells in column A => middle left alignment
                if (row >= 3 && row <= 2 + data.length && col === 1) {
                    currentRow.getCell(col).alignment = middleLeftAlignment;
                } else {
                    currentRow.getCell(col).alignment = middleCenterAlignment;
                }
                // Set bold for Processing Status Section, Total Section & Column A
                if (row < 3
                    || row > 2 + data.length && row <= 2 + data.length + 2
                    || col === 1) {
                    currentRow.getCell(col).font = {
                        bold: true
                    }
                }
            }
        }

        // ---------- Processing Status Section ----------
        // Line column
        worksheet.getColumn('A').width = 18;
        worksheet.mergeCells('A1:A2');
        worksheet.getCell('A1').value = "Processing Status\r\nLine";
        worksheet.getCell('A1').alignment = {...middleLeftAlignment, wrapText: true};

        // Temperature columns
        worksheet.mergeCells('B1:C1');
        worksheet.getCell('B1').value = 'Temperature';
        worksheet.getCell('B2').value = 'AVG.';
        worksheet.getCell('C2').value = 'STDEV';

        // Preparing Time(s) columns
        worksheet.mergeCells('D1:E1');
        worksheet.getCell('D1').value = 'Preparing Time(s)';
        worksheet.getCell('D2').value = 'AVG.';
        worksheet.getCell('E2').value = 'STDEV';

        // Curing Time(s) columns
        worksheet.mergeCells('F1:G1');
        worksheet.getCell('F1').value = 'Curing Time(s)';
        worksheet.getCell('F2').value = 'AVG.';
        worksheet.getCell('G2').value = 'STDEV';

        let startStationRow = 3;
        let endStationRow = startStationRow + data.length - 1;

        let startTotalSectionRow = endStationRow + 1;

        // Total column
        worksheet.mergeCells(`A${startTotalSectionRow}:A${startTotalSectionRow + 1}`);
        worksheet.getCell(`A${startTotalSectionRow}`).value = 'Total';
        worksheet.getCell(`A${startTotalSectionRow}`).alignment = middleCenterAlignment;

        worksheet.getCell(`A${startTotalSectionRow + 2}`).value = 'AVG.';
        worksheet.getCell(`A${startTotalSectionRow + 2}`).alignment = middleLeftAlignment;

        worksheet.getCell(`A${startTotalSectionRow + 3}`).value = 'MAX';
        worksheet.getCell(`A${startTotalSectionRow + 3}`).alignment = middleLeftAlignment;

        worksheet.getCell(`A${startTotalSectionRow + 4}`).value = 'MIN';
        worksheet.getCell(`A${startTotalSectionRow + 4}`).alignment = middleLeftAlignment;

        worksheet.getCell(`A${startTotalSectionRow + 5}`).value = 'STDEV';
        worksheet.getCell(`A${startTotalSectionRow + 5}`).alignment = middleLeftAlignment;

        // Temperature column
        worksheet.mergeCells(`B${startTotalSectionRow}:C${startTotalSectionRow}`);
        worksheet.getCell(`B${startTotalSectionRow}`).value = 'Temperature';
        worksheet.getCell(`B${startTotalSectionRow + 1}`).value = 'AVG.';
        worksheet.getCell(`C${startTotalSectionRow + 1}`).value = 'STDEV';

        // Preparing Time(s) column
        worksheet.mergeCells(`D${startTotalSectionRow}:E${startTotalSectionRow}`);
        worksheet.getCell(`D${startTotalSectionRow}`).value = 'Preparing Time(s)';
        worksheet.getCell(`D${startTotalSectionRow + 1}`).value = 'AVG.';
        worksheet.getCell(`E${startTotalSectionRow + 1}`).value = 'STDEV';

        // Curing Time(s) column
        worksheet.mergeCells(`F${startTotalSectionRow}:G${startTotalSectionRow}`);
        worksheet.getCell(`F${startTotalSectionRow}`).value = 'Curing Time(s)';
        worksheet.getCell(`F${startTotalSectionRow + 1}`).value = 'AVG.';
        worksheet.getCell(`G${startTotalSectionRow + 1}`).value = 'STDEV';

        // ---------- Fill Data into Table ----------
        // For AVG. Row of Total Section
        let sumTempAvg = 0, sumTempStdev = 0,
            sumPrepAvg = 0, sumPrepStdev = 0,
            sumCurAvg = 0, sumCurStdev = 0;

        // For Min-Max Row of Total Section
        let tempAvgMin = Infinity, tempAvgMax = 0, tempStdevMin = Infinity, tempStdevMax = 0,
            prepAvgMin = Infinity, prepAvgMax = 0, prepStdevMin = Infinity, prepStdevMax = 0,
            curAvgMin = Infinity, curAvgMax = 0, curStdevMin = Infinity, curStdevMax = 0;

        // For STDEV Row of Total Section
        let tempAvgArray = [], tempStdevArray = [],
            prepAvgArray = [], prepStdevArray = [],
            curAvgArray = [], curStdevArray = [];
        data.forEach((station, index) => {
            // ---------- Fill Data into Table ----------
            let currentRow = worksheet.getRow(startStationRow + index);
            for (let col = 1; col <= 7; ++col) {
                switch (col) {
                    case 1:
                        currentRow.getCell(col).value = 'Station ' + (+station.idStation);
                        break;
                    case 2:
                        currentRow.getCell(col).value = +station.temp_avg;
                        break;
                    case 3:
                        currentRow.getCell(col).value = +station.temp_stdev;
                        break;
                    case 4:
                        currentRow.getCell(col).value = +station.pre_avg;
                        break;
                    case 5:
                        currentRow.getCell(col).value = +station.pre_stdev;
                        break;
                    case 6:
                        currentRow.getCell(col).value = +station.cur_avg;
                        break;
                    case 7:
                        currentRow.getCell(col).value = +station.cur_stdev;
                        break;
                }
            }

            // ---------- Total for AVG. ----------
            sumTempAvg += +station.temp_avg;
            sumTempStdev += +station.temp_stdev;
            sumPrepAvg += +station.pre_avg;
            sumPrepStdev += +station.pre_stdev;
            sumCurAvg += +station.cur_avg;
            sumCurStdev += +station.cur_stdev;

            // ---------- Min-Max ----------
            // Temperature AVG.
            if (station.temp_avg < tempAvgMin) tempAvgMin = +station.temp_avg;
            if (station.temp_avg > tempAvgMax) tempAvgMax = +station.temp_avg;
            // Temperature STDEV
            if (station.temp_stdev < tempStdevMin) tempStdevMin = +station.temp_stdev;
            if (station.temp_stdev > tempStdevMax) tempStdevMax = +station.temp_stdev;
            // Preparing Time(s) AVG.
            if (station.pre_avg < prepAvgMin) prepAvgMin = +station.pre_avg;
            if (station.pre_avg > prepAvgMax) prepAvgMax = +station.pre_avg;
            // Preparing Time(s) STDEV
            if (station.pre_stdev < prepStdevMin) prepStdevMin = +station.pre_stdev;
            if (station.pre_stdev > prepStdevMax) prepStdevMax = +station.pre_stdev;
            // Curing Time(s) AVG.
            if (station.cur_avg < curAvgMin) curAvgMin = +station.cur_avg;
            if (station.cur_avg > curAvgMax) curAvgMax = +station.cur_avg;
            // Curing Time(s) STDEV
            if (station.cur_stdev < curStdevMin) curStdevMin = +station.cur_stdev;
            if (station.cur_stdev > curStdevMax) curStdevMax = +station.cur_stdev;

            // ---------- Array of data for STDEV ----------
            tempAvgArray.push(+station.temp_avg);
            tempStdevArray.push(+station.temp_stdev);
            prepAvgArray.push(+station.pre_avg);
            prepStdevArray.push(+station.pre_stdev);
            curAvgArray.push(+station.cur_avg);
            curStdevArray.push(+station.cur_stdev);
        });

        // ---------- Calculation ----------
        let totalAVGTempAvg = sumTempAvg / tempAvgArray.length;
        let totalAVGTempStdev = sumTempStdev / tempStdevArray.length;
        let totalAVGPrepAvg = sumPrepAvg / prepAvgArray.length;
        let totalAVGPrepStdev = sumPrepStdev / prepStdevArray.length;
        let totalAVGCurAvg = sumCurAvg / curAvgArray.length;
        let totalAVGCurStdev = sumCurStdev / curStdevArray.length;

        let totalSTDEVTempAvg = standardDeviation(tempAvgArray, totalAVGTempAvg, true);
        let totalSTDEVTempStdev = standardDeviation(tempStdevArray, totalAVGTempStdev, true);
        let totalSTDEVPrepAvg = standardDeviation(prepAvgArray, totalAVGPrepAvg, true);
        let totalSTDEVPrepStdev = standardDeviation(prepStdevArray, totalAVGPrepStdev, true);
        let totalSTDEVCurAvg = standardDeviation(curAvgArray, totalAVGCurAvg, true);
        let totalSTDEVCurStdev = standardDeviation(curStdevArray, totalAVGCurStdev, true);

        // ---------- Total AVG Row ----------
        worksheet.getCell(`B${startTotalSectionRow + 2}`).value = totalAVGTempAvg;
        worksheet.getCell(`C${startTotalSectionRow + 2}`).value = totalAVGTempStdev;
        worksheet.getCell(`D${startTotalSectionRow + 2}`).value = totalAVGPrepAvg;
        worksheet.getCell(`E${startTotalSectionRow + 2}`).value = totalAVGPrepStdev;
        worksheet.getCell(`F${startTotalSectionRow + 2}`).value = totalAVGCurAvg;
        worksheet.getCell(`G${startTotalSectionRow + 2}`).value = totalAVGCurStdev;
        // ---------- Total MAX Row ----------
        worksheet.getCell(`B${startTotalSectionRow + 3}`).value = tempAvgMax;
        worksheet.getCell(`C${startTotalSectionRow + 3}`).value = tempStdevMax;
        worksheet.getCell(`D${startTotalSectionRow + 3}`).value = prepAvgMax;
        worksheet.getCell(`E${startTotalSectionRow + 3}`).value = prepStdevMax;
        worksheet.getCell(`F${startTotalSectionRow + 3}`).value = curAvgMax;
        worksheet.getCell(`G${startTotalSectionRow + 3}`).value = curStdevMax;
        // ---------- Total MIN Row ----------
        worksheet.getCell(`B${startTotalSectionRow + 4}`).value = tempAvgMin;
        worksheet.getCell(`C${startTotalSectionRow + 4}`).value = tempStdevMin;
        worksheet.getCell(`D${startTotalSectionRow + 4}`).value = prepAvgMin;
        worksheet.getCell(`E${startTotalSectionRow + 4}`).value = prepStdevMin;
        worksheet.getCell(`F${startTotalSectionRow + 4}`).value = curAvgMin;
        worksheet.getCell(`G${startTotalSectionRow + 4}`).value = curStdevMin;
        // ---------- Total STDEV Row ----------
        worksheet.getCell(`B${startTotalSectionRow + 5}`).value = totalSTDEVTempAvg;
        worksheet.getCell(`C${startTotalSectionRow + 5}`).value = totalSTDEVTempStdev;
        worksheet.getCell(`D${startTotalSectionRow + 5}`).value = totalSTDEVPrepAvg;
        worksheet.getCell(`E${startTotalSectionRow + 5}`).value = totalSTDEVPrepStdev;
        worksheet.getCell(`F${startTotalSectionRow + 5}`).value = totalSTDEVCurAvg;
        worksheet.getCell(`G${startTotalSectionRow + 5}`).value = totalSTDEVCurStdev;

        workbook.xlsx.writeBuffer()
            .then(buffer => FileSaver.saveAs(
                new Blob([buffer]),
                'Smart_Sensing_Chart_Data.xlsx' // Excel File Name
            ))
            .catch(err => console.log('Error writing excel export', err));
    }

    exportPDFFile(data) {
        // paper orientation -> landscape, unit -> pt: point, paper type -> A3
        let doc = new jsPDF('landscape', 'pt', 'a3');
        doc.setFontSize(12);
        // doc.setTextColor('#000');
        doc.setProperties({
            title: 'Smart Sensing Chart Data',
            subject: 'Table of Data & Data Visualization Sheet',
            author: 'trile@snaglobal.net',
            creator: 'trile@snaglobal.net',
        });

        let middleLeftStyle = {
            font: 'helvetica',
            halign: 'left',
            valign: 'middle',
            cellWidth: 'wrap',
        };
        let middleCenterStyle = {
            font: 'helvetica',
            halign: 'center',
            valign: 'middle',
            cellWidth: 'wrap',
        };

        // ---------- Processing Status Line Section ----------
        let body = [
            {
                col1: {
                    content: 'Processing Status\r\nLine',
                    rowSpan: 2,
                    styles: {
                        ...middleLeftStyle,
                        fontStyle: 'bold',
                    },
                },
                col2: {
                    content: 'Temperature',
                    colSpan: 2,
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col3: '',
                col4: {
                    content: 'Preparing Time(s)',
                    colSpan: 2,
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col5: '',
                col6: {
                    content: 'Curing Time(s)',
                    colSpan: 2,
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col7: '',
            },
            {
                col1: '',
                col2: {
                    content: 'AVG.',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col3: {
                    content: 'STDEV',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col4: {
                    content: 'AVG.',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col5: {
                    content: 'STDEV',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col6: {
                    content: 'AVG.',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col7: {
                    content: 'STDEV',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
            },
        ];

        // ---------- Fill Processing Status Line Section Data into table ----------
        data.processingStatusLine.forEach((station, index) => {
            body.push({
                col1: {
                    content: `Station ${index + 1}`,
                    styles: {
                        ...middleLeftStyle,
                        fontStyle: 'bold',
                    },
                },
                col2: {
                    content: station[0],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col3: {
                    content: station[1],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col4: {
                    content: station[2],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col5: {
                    content: station[3],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col6: {
                    content: station[4],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col7: {
                    content: station[5],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
            });
        });

        // ---------- General Section ----------
        body.push(
            {
                col1: {
                    content: 'General',
                    rowSpan: 2,
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col2: {
                    content: 'Temperature',
                    colSpan: 2,
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col3: '',
                col4: {
                    content: 'Preparing Time(s)',
                    colSpan: 2,
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col5: '',
                col6: {
                    content: 'Curing Time(s)',
                    colSpan: 2,
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col7: '',
            },
            {
                col1: '',
                col2: {
                    content: 'AVG.',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col3: {
                    content: 'STDEV',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col4: {
                    content: 'AVG.',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col5: {
                    content: 'STDEV',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col6: {
                    content: 'AVG.',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col7: {
                    content: 'STDEV',
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
            },
        );

        // ---------- Fill General Data into table ----------
        data.general.forEach((generalData, index) => {
            body.push({
                col1: {
                    content: index === 0 ? 'AVG.' : index === 1 ? 'MAX' : index === 2 ? 'MIN' : 'STDEV',
                    styles: {
                        ...middleLeftStyle,
                        fontStyle: 'bold',
                    },
                },
                col2: {
                    content: generalData[0],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col3: {
                    content: generalData[1],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col4: {
                    content: generalData[2],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col5: {
                    content: generalData[3],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col6: {
                    content: generalData[4],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
                col7: {
                    content: generalData[5],
                    styles: {
                        ...middleCenterStyle,
                    },
                },
            });
        });

        const dashboardContainer = document.getElementById(DashboardContainerID);

        html2canvas(dashboardContainer).then((canvas) => {
            const screenShotData = canvas.toDataURL('image/png');

            var width = doc.internal.pageSize.getWidth();
            var height = doc.internal.pageSize.getHeight();

            // Add snapshot of full page
            doc.addImage(screenShotData, 'PNG', 0, 0, width, height);

            doc.addPage();  // Add new page

            // Add Table of Data
            doc.autoTable({
                body: body,
                theme: 'grid',
            });

            doc.save('Smart_Sensing_Chart_Data.pdf');
        });
    }

    render() {
        let {exportType} = this.props;

        switch (exportType) {
            case ExportType.EXCEL:
                return (
                    <div className="data-exporter__button"
                         onClick={() => this.exportExcelFile(TestData)}>
                        <span className="data-exporter__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21.3333 0H2.66667C1.2 0 0 1.2 0 2.66667V21.3333C0 22.8 1.2 24 2.66667 24H21.3333C22.8 24 24 22.8 24 21.3333V2.66667C24 1.2 22.8 0 21.3333 0ZM17.6 18.6667H14.9333L12 13.6L9.06667 18.6667H6.4L10.6667 12L6.4 5.33333H9.06667L12 10.4L14.9333 5.33333H17.6L13.3333 12L17.6 18.6667Z"
                                    fill="black"/>
                            </svg>
                        </span>
                        <span className="data-exporter__type">
                            {ExportType.EXCEL}
                        </span>
                    </div>
                );
            case ExportType.PDF:
                return (
                    <div className="data-exporter__button"
                         onClick={() => this.exportPDFFile(DummyTableData)}>
                        <span className="data-exporter__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.0667 7.46667C11.2 7.46667 11.2 7.46667 11.0667 7.46667C11.2 6.93333 11.3333 6.66667 11.3333 6.26667V6C11.4667 5.33333 11.4667 4.8 11.3333 4.66667C11.3333 4.66667 11.3333 4.66667 11.3333 4.53333L11.2 4.4C11.2 4.4 11.2 4.53333 11.0667 4.53333C10.8 5.33333 10.8 6.26667 11.0667 7.46667ZM7.06667 16.6667C6.8 16.8 6.53333 16.9333 6.4 17.0667C5.46667 17.8667 4.8 18.7999 4.66667 19.2C5.46667 19.0667 6.26667 18.2667 7.06667 16.6667C7.2 16.6667 7.2 16.6667 7.06667 16.6667C7.2 16.6667 7.06667 16.6667 7.06667 16.6667ZM19.3333 14.6667C19.2 14.5333 18.6667 14.1333 16.8 14.1333C16.6667 14.1333 16.6667 14.1333 16.5333 14.1333C16.5333 14.1333 16.5333 14.1333 16.5333 14.2667C17.4667 14.6667 18.4 14.9333 19.0667 14.9333C19.2 14.9333 19.2 14.9333 19.3333 14.9333H19.4667C19.4667 14.9333 19.4667 14.9333 19.4667 14.8C19.4667 14.8 19.3333 14.8 19.3333 14.6667ZM21.3333 0H2.66667C1.2 0 0 1.2 0 2.66667V21.3333C0 22.8 1.2 24 2.66667 24H21.3333C22.8 24 24 22.8 24 21.3333V2.66667C24 1.2 22.8 0 21.3333 0ZM19.8667 15.7333C19.5999 15.8667 19.2 16 18.6667 16C17.6 16 16 15.7333 14.6667 15.0667C12.4 15.3333 10.6667 15.5999 9.33333 16.1333C9.2 16.1333 9.2 16.1333 9.06667 16.2666C7.46667 19.0667 6.13333 20.4 5.06667 20.4C4.8 20.4 4.66667 20.4 4.53333 20.2666L3.86667 19.8667V19.7333C3.73333 19.4666 3.73333 19.3333 3.73333 19.0667C3.86667 18.4 4.66667 17.2 6.26667 16.2666C6.53333 16.1333 6.93333 15.8667 7.46667 15.5999C7.86667 14.9333 8.26667 14.1333 8.8 13.2C9.46667 11.8667 9.86667 10.5333 10.2667 9.33333C9.73333 7.73333 9.46667 6.8 10 4.93333C10.1333 4.4 10.5333 3.86667 11.0667 3.86667H11.3333C11.6 3.86667 11.8667 4 12.1333 4.13333C13.0667 5.06667 12.6667 7.2 12.1333 8.93333C12.1333 9.06667 12.1333 9.06667 12.1333 9.06667C12.6667 10.5333 13.4667 11.7333 14.2667 12.5333C14.6667 12.8 14.9333 13.0667 15.4667 13.3333C16.1333 13.3333 16.6667 13.2 17.2 13.2C18.8 13.2 19.8667 13.4667 20.2666 14.1333C20.4 14.4001 20.4 14.6667 20.4 14.9333C20.2667 15.0667 20.1333 15.4667 19.8667 15.7333ZM11.2 10.5333C10.9333 11.4667 10.4 12.5333 9.86667 13.7333C9.6 14.2666 9.33333 14.6667 9.06667 15.2H9.2H9.33333C11.0667 14.5333 12.6667 14.1333 13.7333 14C13.4666 13.8667 13.3333 13.7333 13.2 13.6C12.5333 12.8 11.7333 11.7333 11.2 10.5333Z"
                                    fill="black"/>
                            </svg>
                        </span>
                        <span className="data-exporter__type">
                            {ExportType.PDF}
                        </span>
                    </div>
                );
            case ExportType.PNG:
                // TODO Add PNG Exporter
                return (
                    <div className="data-exporter__button">
                        <span className="data-exporter__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M24 21.3333V2.66667C24 1.2 22.8 0 21.3333 0H2.66667C1.2 0 0 1.2 0 2.66667V21.3333C0 22.8 1.2 24 2.66667 24H21.3333C22.8 24 24 22.8 24 21.3333ZM7.33333 14L10.6667 18L15.3333 12L21.3333 20H2.66667L7.33333 14Z"
                                    fill="black"/>
                            </svg>
                        </span>
                        <span className="data-exporter__type">
                            {ExportType.PNG}
                        </span>
                    </div>
                );
            default:
                throw new Error('Export type is not defined');
        }
    }
}

const DummyTableData = {
    processingStatusLine: [
        [591.65, 171.76, 0, 0, 390.81, 217.65],
        [568.17, 178.87, 0, 0, 354.01, 237.16],
        [555.82, 202.67, 0, 0, 352.94, 236.53],
        [662.03, 26.47, 0, 0, 353.65, 237.12],
        [657.39, 24.85, 0, 0, 352.72, 236.56],
        [659.37, 26.96, 0, 0, 351.88, 236.08],
        [658.71, 23.67, 0, 0, 351.92, 236.08],
        [657.94, 24.55, 0, 0, 350.69, 235.05,],
    ],
    general: [
        [626.385, 84.975, 0, 0, 357.3275, 234.02875],
        [662.03, 202.67, 0, 0, 390.81, 237.16],
        [555.82, 23.67, 0, 0, 350.69, 217.65],
        [43.20797901, 77.47023202, 0, 0, 12.69379548, 6.222395916],
    ],
};

const TestData = [
    {
        Target: 14,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 390.81,
        cur_stdev: 217.65,
        first_shift: "0",
        idLine: "1039",
        idStation: "1",
        iddata: 756578,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 591.65,
        temp_stdev: 171.76,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 354.01,
        cur_stdev: 237.16,
        first_shift: "0",
        idLine: "1039",
        idStation: "2",
        iddata: 836579,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 568.17,
        temp_stdev: 178.87,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 0,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 352.94,
        cur_stdev: 236.53,
        first_shift: "0",
        idLine: "1039",
        idStation: "3",
        iddata: 836578,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 555.82,
        temp_stdev: 202.67,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 353.65,
        cur_stdev: 237.12,
        first_shift: "0",
        idLine: "1039",
        idStation: "4",
        iddata: 836577,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 662.03,
        temp_stdev: 26.47,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 12,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 352.72,
        cur_stdev: 236.56,
        first_shift: "0",
        idLine: "1039",
        idStation: "5",
        iddata: 836582,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 657.39,
        temp_stdev: 24.85,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 351.88,
        cur_stdev: 236.08,
        first_shift: "0",
        idLine: "1039",
        idStation: "6",
        iddata: 836581,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 659.37,
        temp_stdev: 26.96,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 351.92,
        cur_stdev: 236.08,
        first_shift: "0",
        idLine: "1039",
        idStation: "7",
        iddata: 836574,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 658.71,
        temp_stdev: 23.67,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
    {
        Target: 13,
        TempWarning1: 180,
        TempWarning2: 190,
        cur_avg: 350.69,
        cur_stdev: 235.05,
        first_shift: "0",
        idLine: "1039",
        idStation: "8",
        iddata: 836573,
        pre_avg: 0,
        pre_stdev: 0,
        second_shift: "0",
        temp_avg: 657.94,
        temp_stdev: 24.55,
        third_shift: "0",
        timeRecieved: 1547715146,
        timedevice: 1547715177,
    },
];
