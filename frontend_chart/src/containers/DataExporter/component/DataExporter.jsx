import React, {Component} from 'react';
import Excel from './../../../../node_modules/exceljs/dist/es5/exceljs.browser';
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import {
    ANALYSIS_CONTAINER_ID,
    ANALYSIS_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID,
    ANALYSIS_PROCESSING_STATUS_ID,
    ANALYSIS_SHIFT_STATUS_ID,
    ANALYSIS_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID,
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_1_2_ID,
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_3_4_ID,
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_5_6_ID,
    ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_7_8_ID,
    DASHBOARD_CONTAINER_ID,
    DASHBOARD_DOWN_TIME_BY_SHIFT_ID,
    DASHBOARD_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID,
    DASHBOARD_PROCESSING_STATUS_ID,
    DASHBOARD_STATION_STATUS_SHIFT_STATUS_ID,
    DASHBOARD_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID,
    DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_1_2_ID,
    DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_3_4_ID,
    DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_5_6_ID,
    DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_7_8_ID,
    ExportType,
    ROUTE
} from "../../../constants/constants";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';

class DataExporter extends Component {

    exportExcelFile(props, location) {
        let fileName = '';
        let stationStatusData = null, shiftStatusData= null,
            processStatusData = null, downTimeShiftData = null;
        switch (location.pathname) {
            case ROUTE.Dashboard:
                fileName = 'Dashboard';
                stationStatusData = props.downloadDataStore.stationStatusData;
                shiftStatusData = props.downloadDataStore.shiftStatusData;
                processStatusData = props.downloadDataStore.processStatusData;
                downTimeShiftData = props.downloadDataStore.downTimeShiftData;
                break;
            case ROUTE.Analysis:
                fileName = 'Analysis';
                stationStatusData = props.downloadDataStore.stationStatusData;
                shiftStatusData = props.downloadDataStore.shiftStatusData;
                processStatusData = props.downloadDataStore.processStatusData;
                downTimeShiftData = props.downloadDataStore.downTimeShiftData;
                break;
            case ROUTE.Report:
                fileName = 'Report';
                break;
        }

        // Create new Workbook
        let workbook = new Excel.Workbook();
        workbook.creator = 'trile@snaglobal.net';
        workbook.lastModifiedBy = 'trile@snaglobal.net';
        workbook.created = new Date();
        workbook.modified = new Date();

        // Add Station Status Data Worksheet
        if (stationStatusData) {
            addStationStatusDataTableExcel(workbook, stationStatusData);
        }
        // Add Shift Status Data Worksheet
        if (shiftStatusData) {
            addShiftStatusDataTableExcel(workbook, shiftStatusData);
        }
        // Add Process Status Data Worksheet
        if (processStatusData) {
            let {processingStatusLine, general} = processStatusData;
            addProcessStatusDataTableExcel(workbook, processingStatusLine, general);
        }
        // Add Down Time Shift Data Worksheet
        if (downTimeShiftData) {
            addDownTimeShiftDataTableExcel(workbook, downTimeShiftData);
        }

        if (!stationStatusData && !shiftStatusData && !processStatusData && !downTimeShiftData) {
            workbook.addWorksheet('Empty Sheet');
        }

        workbook.xlsx.writeBuffer()
            .then(buffer => FileSaver.saveAs(
                new Blob([buffer]),
                fileName
                    ? `${fileName}_Smart_Sensing_Chart_Data.xlsx`
                    : 'Smart_Sensing_Chart_Data.xlsx' // Excel File Name
            ))
            .catch(err => console.log('Error writing excel export', err));
    }

    exportPDFFile(props, location) {
        let fileName = '';
        let processStatusData = null;
        let imageExportContainerElements = null;
        switch (location.pathname) {
            case ROUTE.Dashboard:
                fileName = 'Dashboard';
                processStatusData = props.downloadDataStore.processStatusData;
                imageExportContainerElements = [];
                imageExportContainerElements.push(document.getElementById(DASHBOARD_STATION_STATUS_SHIFT_STATUS_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_1_2_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_3_4_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_5_6_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_TEMPERATURE_TREND_ITEM_STATION_7_8_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_PROCESSING_STATUS_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_DOWN_TIME_BY_SHIFT_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID));
                imageExportContainerElements.push(document.getElementById(DASHBOARD_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID));
                break;
            case ROUTE.Analysis:
                fileName = 'Analysis';
                processStatusData = props.downloadDataStore.processStatusData;
                imageExportContainerElements = [];
                imageExportContainerElements.push(document.getElementById(ANALYSIS_SHIFT_STATUS_ID));
                imageExportContainerElements.push(document.getElementById(ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_1_2_ID));
                imageExportContainerElements.push(document.getElementById(ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_3_4_ID));
                imageExportContainerElements.push(document.getElementById(ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_5_6_ID));
                imageExportContainerElements.push(document.getElementById(ANALYSIS_TEMPERATURE_TREND_ITEM_STATION_7_8_ID));
                imageExportContainerElements.push(document.getElementById(ANALYSIS_PROCESSING_STATUS_ID));
                imageExportContainerElements.push(document.getElementById(ANALYSIS_OEE_CHART_OEE_GENERAL_LOSS_OF_WORK_CYCLE_DEFECT_STATION_COMPARISON_ID));
                imageExportContainerElements.push(document.getElementById(ANALYSIS_SWING_ARM_MACHINE_SWING_OS_STATION_COMPARISON_ID));
                break;
            case ROUTE.Report:
                fileName = 'Report';
                break;
        }

        // paper orientation -> landscape, unit -> pt: point, paper type -> A3
        let doc = new jsPDF('landscape', 'pt', 'a3');
        doc.setFontSize(12);
        // doc.setTextColor('#000');
        doc.setProperties({
            title: fileName ? `${fileName} - Smart Sensing Chart Data` : 'Smart Sensing Chart Data',
            subject: 'Smart Sensing Chart Data',
            author: 'trile@snaglobal.net',
            creator: 'trile@snaglobal.net',
        });

        let tableStyle = {
            font: 'helvetica',
            cellWidth: 'wrap',
        };

        if (imageExportContainerElements) {
            let mapOfContainerCanvas = new Map();
            imageExportContainerElements.forEach((element, index) => {
                html2canvas(element).then((canvas) => mapOfContainerCanvas.set(index, canvas));
            });
            var saveDocInterval = setInterval(() => {
                console.log("SAVE_DOC_INTERVAL=============================",);
                switch (location.pathname) {
                    case ROUTE.Dashboard:
                        if (mapOfContainerCanvas.size === 9) {
                            clearInterval(saveDocInterval);

                            let mapCanvasAscending = new Map([...mapOfContainerCanvas.entries()].sort());
                            mapCanvasAscending.forEach((canvas, key, mapCanvas) => {
                                const screenShotData = canvas.toDataURL('image/png');

                                let width = doc.internal.pageSize.getWidth();
                                let height = canvas.height > doc.internal.pageSize.getHeight()
                                    ? doc.internal.pageSize.getHeight()
                                    : canvas.height;

                                // Add snapshot of full page
                                doc.addImage(screenShotData, 'PNG', 0, 0, width, height);

                                if (key !== mapCanvas.size - 1) {
                                    doc.addPage();  // Add new page
                                }
                            });
                            if (processStatusData) {
                                doc.addPage();  // Add new page

                                let {processingStatusLine, general} = processStatusData;
                                addProcessStatusDataTablePDF(doc, tableStyle, processingStatusLine, general);
                            }

                            doc.save(
                                fileName ? `${fileName}_Smart_Sensing_Chart_Data.pdf` : 'Smart_Sensing_Chart_Data.pdf'
                            );
                        }
                        break;
                    case ROUTE.Analysis:
                        if (mapOfContainerCanvas.size === 8) {
                            clearInterval(saveDocInterval);

                            let mapCanvasAscending = new Map([...mapOfContainerCanvas.entries()].sort());
                            mapCanvasAscending.forEach((canvas, key, mapCanvas) => {
                                const screenShotData = canvas.toDataURL('image/png');

                                let width = doc.internal.pageSize.getWidth();
                                let height = canvas.height > doc.internal.pageSize.getHeight()
                                    ? doc.internal.pageSize.getHeight()
                                    : canvas.height;

                                // Add snapshot of full page
                                doc.addImage(screenShotData, 'PNG', 0, 0, width, height);

                                if (key !== mapCanvas.size - 1) {
                                    doc.addPage();  // Add new page
                                }
                            });
                            if (processStatusData) {
                                doc.addPage();  // Add new page

                                let {processingStatusLine, general} = processStatusData;
                                addProcessStatusDataTablePDF(doc, tableStyle, processingStatusLine, general);
                            }

                            doc.save(
                                fileName ? `${fileName}_Smart_Sensing_Chart_Data.pdf` : 'Smart_Sensing_Chart_Data.pdf'
                            );
                        }
                        break;
                    case ROUTE.Report:
                        // todo Export PDF for Report
                        saveDocInterval.clearInterval();
                        break;
                }
            }, 1000);
        }
    }

    exportPNGFile(location) {
        let fileName = '';
        let imageExportContainerID = null;
        switch (location.pathname) {
            case ROUTE.Dashboard:
                fileName = 'Dashboard';
                imageExportContainerID = document.getElementById(DASHBOARD_CONTAINER_ID);
                break;
            case ROUTE.Analysis:
                fileName = 'Analysis';
                imageExportContainerID = document.getElementById(ANALYSIS_CONTAINER_ID);
                break;
            case ROUTE.Report:
                fileName = 'Report';
                break;
        }

        if (imageExportContainerID) {
            html2canvas(imageExportContainerID).then((canvas) => {
                const screenShotData = canvas.toDataURL('image/png');

                let link = document.createElement('a');

                if (typeof link.download === 'string') {
                    link.href = screenShotData;
                    link.download = fileName ? `${fileName}_Smart_Sensing_Chart_Data` : 'Smart_Sensing_Chart_Data';

                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);

                    //simulate click
                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);
                } else {
                    window.open(screenShotData);
                }
            });
        }
    }

    render() {
        let {exportType, location} = this.props;

        switch (exportType) {
            case ExportType.EXCEL:
                return (
                    <div className="data-exporter__button"
                         onClick={() => this.exportExcelFile(this.props, location)}>
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
                         onClick={() => this.exportPDFFile(this.props, location)}>
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
                return (
                    <div className="data-exporter__button"
                         onClick={() => this.exportPNGFile(location)}>
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

function addStationStatusDataTableExcel(workbook, stationStatusData) {
    // Add new Worksheet
    let worksheet = workbook.addWorksheet('Station_Status_Data');

    let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};

    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = "STATION STATUS";

    worksheet.getCell('A2').value = "STATION";
    worksheet.getCell('B2').value = "STATUS";

    worksheet.getColumn(3).width = 14;
    worksheet.getCell('C2').value = "TIME";

    for (let row = 1; row <= 2 + stationStatusData.length; ++row) {

        let currentRow = worksheet.getRow(row);

        for (let col = 1; col <= 3; ++col) {
            currentRow.getCell(col).border = {
                top: row === 1 ? {style: 'thick'} : {style: 'thin'},
                left: col === 1 ? {style: 'thick'} : {style: 'thin'},
                bottom: row === 2 + stationStatusData.length ? {style: 'thick'} : {style: 'thin'},
                right: col === 3 ? {style: 'thick'} : {style: 'thin'}
            };
            currentRow.getCell(col).alignment = middleCenterAlignment;

            if (row < 3 || col === 1) {
                currentRow.getCell(col).font = {
                    bold: true
                }
            }
        }
    }

    let startRow = 3;
    stationStatusData.forEach((stationData, index) => {
        let currentRow = worksheet.getRow((startRow + index));
        stationData.forEach((value, index) => {
            if (index === 1) {
                currentRow.getCell(index + 1).value = value === 1 ? 'On' : 'Off';
            } else {
                currentRow.getCell(index + 1).value = value;
            }
        })
    });
}

function addShiftStatusDataTableExcel(workbook, shiftStatusData) {
    // Add new Worksheet
    let worksheet = workbook.addWorksheet('Shift_Status_Data');

    let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
    let middleRightAlignment = {vertical: 'middle', horizontal: 'right'};

    worksheet.mergeCells('A1:J1');
    worksheet.getCell('A1').value = "SHIFT STATUS";

    worksheet.mergeCells('A2:A3');
    worksheet.getCell('A2').value = "SHIFT NO.";

    worksheet.mergeCells('B2:I2');
    worksheet.getCell('B2').value = "STATION";

    worksheet.mergeCells('J2:J3');
    worksheet.getCell('J2').value = "TOTAL";

    for (let col = 1; col <= 1 + shiftStatusData[0].length; ++col) {
        worksheet.getColumn(col).width = 14
    }

    for (let row = 1; row <= 3 + shiftStatusData.length; ++row) {
        let currentRow = worksheet.getRow(row);

        for (let col = 1; col <= 1 + shiftStatusData[0].length; ++col) {
            currentRow.getCell(col).border = {
                top: row === 1 ? {style: 'thick'} : {style: 'thin'},
                left: col === 1 ? {style: 'thick'} : {style: 'thin'},
                bottom: row === 3 + shiftStatusData.length ? {style: 'thick'} : {style: 'thin'},
                right: col === 1 + shiftStatusData[0].length ? {style: 'thick'} : {style: 'thin'}
            };

            if (row > 3 && col > 1) {
                currentRow.getCell(col).alignment = middleRightAlignment;
            } else {
                currentRow.getCell(col).alignment = middleCenterAlignment;
            }

            if (row < 4 || col === 1 || col === 1 + shiftStatusData[0].length) {
                currentRow.getCell(col).font = {
                    bold: true
                }
            }
        }
    }

    for (let col = 2; col <= shiftStatusData[0].length; ++col) {
        worksheet.getRow(3).getCell(col).value = col - 1;
    }
    for (let row = 4; row <= 3 + shiftStatusData.length; ++row) {
        worksheet.getRow(row).getCell(1).value = row - 3;
    }

    shiftStatusData.forEach((shiftData, index) => {
        let currentRow = worksheet.getRow(4 + index);
        shiftData.forEach((value, index) => {
            currentRow.getCell(1 + index + 1).value = value;
        })
    });
}

function addProcessStatusDataTableExcel(workbook, processingStatusLine, general) {
    // Add new Worksheet
    let worksheet = workbook.addWorksheet('Process_Status_Data');

    // ---------- Draw borders and define text alignments for every cell of the table ----------
    let middleLeftAlignment = {vertical: 'middle', horizontal: 'left'};
    let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
    let middleRightAlignment = {vertical: 'middle', horizontal: 'right'};
    // 2: 2 first rows for Processing Status section
    // processingStatusLine.length: number of stations
    // 6: 6 rows for Total section
    for (let row = 1; row <= 2 + processingStatusLine.length + 6; ++row) {  // Number of rows

        let currentRow = worksheet.getRow(row);

        for (let col = 1; col <= 7; ++col) {  // Number of columns
            currentRow.getCell(col).border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
            // Station [num] cells in column A => middle left alignment
            if (row >= 3 && row <= 2 + processingStatusLine.length && col === 1) {
                currentRow.getCell(col).alignment = middleLeftAlignment;
            } else if (col > 1 && row >= 3 && row <= 2 + processingStatusLine.length
                || col > 1 && row > 2 + processingStatusLine.length + 2) {
                currentRow.getCell(col).alignment = middleRightAlignment;
            } else {
                currentRow.getCell(col).alignment = middleCenterAlignment;
            }
            // Set bold for Processing Status Section, Total Section & Column A
            if (row < 3
                || row > 2 + processingStatusLine.length && row <= 2 + processingStatusLine.length + 2
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
    let endStationRow = startStationRow + processingStatusLine.length - 1;

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
    processingStatusLine.forEach((station, index) => {
        // ---------- Fill Data into Table ----------
        let currentRow = worksheet.getRow(startStationRow + index);
        for (let col = 1; col <= 7; ++col) {
            currentRow.getCell(col).value = col === 1 ? `Station ${station[col]}` : station[col];
        }
    });

    // ---------- Fill General Data into table ----------
    general.forEach((generalData, index) => {
        worksheet.getCell(`B${startTotalSectionRow + (2 + index)}`).value = generalData[0].toString();
        worksheet.getCell(`C${startTotalSectionRow + (2 + index)}`).value = generalData[1].toString();
        worksheet.getCell(`D${startTotalSectionRow + (2 + index)}`).value = generalData[2].toString();
        worksheet.getCell(`E${startTotalSectionRow + (2 + index)}`).value = generalData[3].toString();
        worksheet.getCell(`F${startTotalSectionRow + (2 + index)}`).value = generalData[4].toString();
        worksheet.getCell(`G${startTotalSectionRow + (2 + index)}`).value = generalData[5].toString();
    });
}

function addDownTimeShiftDataTableExcel(workbook, downTimeShiftData) {
    // Add new Worksheet
    let worksheet = workbook.addWorksheet('Down_Time_Shift_Data');

    let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
    let middleRightAlignment = {vertical: 'middle', horizontal: 'right'};

    worksheet.mergeCells('A1:J1');
    worksheet.getCell('A1').value = "DOWN TIME BY SHIFT";

    worksheet.mergeCells('A2:A3');
    worksheet.getCell('A2').value = "SHIFT NO.";

    worksheet.mergeCells('B2:I2');
    worksheet.getCell('B2').value = "STATION";

    worksheet.mergeCells('J2:J3');
    worksheet.getCell('J2').value = "TOTAL";

    for (let col = 1; col <= 1 + downTimeShiftData[0].length; ++col) {
        worksheet.getColumn(col).width = 14
    }

    for (let row = 1; row <= 3 + downTimeShiftData.length; ++row) {

        let currentRow = worksheet.getRow(row);

        for (let col = 1; col <= 1 + downTimeShiftData[0].length; ++col) {
            currentRow.getCell(col).border = {
                top: row === 1 ? {style: 'thick'} : {style: 'thin'},
                left: col === 1 ? {style: 'thick'} : {style: 'thin'},
                bottom: row === 3 + downTimeShiftData.length ? {style: 'thick'} : {style: 'thin'},
                right: col === 1 + downTimeShiftData[0].length ? {style: 'thick'} : {style: 'thin'}
            };

            if (row > 3 && col > 1) {
                currentRow.getCell(col).alignment = middleRightAlignment;
            } else {
                currentRow.getCell(col).alignment = middleCenterAlignment;
            }

            if (row < 4 || col === 1 || col === 1 + downTimeShiftData[0].length) {
                currentRow.getCell(col).font = {
                    bold: true
                }
            }
        }
    }

    for (let col = 2; col <= downTimeShiftData[0].length; ++col) {
        worksheet.getRow(3).getCell(col).value = col - 1;
    }
    for (let row = 4; row <= 3 + downTimeShiftData.length; ++row) {
        worksheet.getRow(row).getCell(1).value = row - 3;
    }

    downTimeShiftData.forEach((shiftData, index) => {
        let currentRow = worksheet.getRow(4 + index);
        shiftData.forEach((value, index) => {
            currentRow.getCell(1 + index + 1).value = value;
        })
    });
}

function addProcessStatusDataTablePDF(doc, tableStyle, processingStatusLine, general) {
    let middleLeftStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'left',
    };
    let middleCenterStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'center',
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
    processingStatusLine.forEach((station) => {
        body.push({
            col1: {
                content: `Station ${station[1]}`,
                styles: {
                    ...middleLeftStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: station[2],
                styles: {
                    ...middleCenterStyle,
                },
            },
            col3: {
                content: station[3],
                styles: {
                    ...middleCenterStyle,
                },
            },
            col4: {
                content: station[4],
                styles: {
                    ...middleCenterStyle,
                },
            },
            col5: {
                content: station[5],
                styles: {
                    ...middleCenterStyle,
                },
            },
            col6: {
                content: station[6],
                styles: {
                    ...middleCenterStyle,
                },
            },
            col7: {
                content: station[7],
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
    general.forEach((generalData, index) => {
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

    // Add Table of Data
    doc.autoTable({
        body: body,
        theme: 'grid',
    });
}

const mapStateToProps = state => ({
    downloadDataStore: state.downloadDataStore
});

export default withRouter(connect(mapStateToProps)(DataExporter));
