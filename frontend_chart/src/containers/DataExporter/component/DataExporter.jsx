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
    REPORT_CONTAINER_ID,
    REPORT_DEFECT_RATE_ID,
    REPORT_PRODUCTION_RATE_ID,
    ROUTE
} from "../../../constants/constants";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {changeNumberFormat} from "../../../shared/utils/Utilities";

class DataExporter extends Component {

    exportExcelFile(props, location) {
        let fileName = '';
        let stationStatusData = null, shiftStatusData = null,
            processStatusData = null, downTimeShiftData = null;
        let productionRateData = null, defectRateData = null;
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
                shiftStatusData = props.downloadDataStore.shiftStatusData;
                processStatusData = props.downloadDataStore.processStatusData;
                break;
            case ROUTE.Report:
                fileName = 'Report';
                productionRateData = props.downloadDataStore.productionRateData;
                defectRateData = props.downloadDataStore.defectRateData;
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
        // Add Production Rate Data Worksheet
        if (productionRateData) {
            addProductionRateDataTableExcel(workbook, productionRateData);
        }
        // Add Defect Rate Data Worksheet
        if (defectRateData) {
            addDefectRateDataTableExcel(workbook, defectRateData);
        }

        if (!stationStatusData && !shiftStatusData && !processStatusData && !downTimeShiftData
            && !productionRateData && !defectRateData) {
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
        let stationStatusData = null, shiftStatusData = null,
            processStatusData = null, downTimeShiftData = null;
        let productionRateData = null, defectRateData = null;
        let imageExportContainerElements = null;
        switch (location.pathname) {
            case ROUTE.Dashboard:
                fileName = 'Dashboard';
                stationStatusData = props.downloadDataStore.stationStatusData;
                shiftStatusData = props.downloadDataStore.shiftStatusData;
                processStatusData = props.downloadDataStore.processStatusData;
                downTimeShiftData = props.downloadDataStore.downTimeShiftData;
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
                shiftStatusData = props.downloadDataStore.shiftStatusData;
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
                productionRateData = props.downloadDataStore.productionRateData;
                defectRateData = props.downloadDataStore.defectRateData;
                imageExportContainerElements = [];
                if (productionRateData) {
                    imageExportContainerElements.push(document.getElementById(REPORT_PRODUCTION_RATE_ID));
                }
                if (defectRateData) {
                    imageExportContainerElements.push(document.getElementById(REPORT_DEFECT_RATE_ID));
                }
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
                            if (stationStatusData) {
                                doc.addPage();  // Add new page

                                addStationStatusDataTablePDF(doc, tableStyle, stationStatusData);
                            }
                            if (shiftStatusData) {
                                doc.addPage();  // Add new page

                                addShiftStatusDataTablePDF(doc, tableStyle, shiftStatusData);
                            }
                            if (processStatusData) {
                                doc.addPage();  // Add new page

                                let {processingStatusLine, general} = processStatusData;
                                addProcessStatusDataTablePDF(doc, tableStyle, processingStatusLine, general);
                            }
                            if (downTimeShiftData) {
                                doc.addPage();  // Add new page

                                addDownTimeShiftDataTablePDF(doc, tableStyle, downTimeShiftData);
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
                            if (shiftStatusData) {
                                doc.addPage();  // Add new page

                                addShiftStatusDataTablePDF(doc, tableStyle, shiftStatusData);
                            }
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
                        if (mapOfContainerCanvas.size === 1) {
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
                            if (productionRateData) {
                                doc.addPage();  // Add new page

                                addProductionRateDataTablePDF(doc, tableStyle, productionRateData);
                            }
                            if (defectRateData) {
                                doc.addPage();  // Add new page

                                addDefectRateDataTablePDF(doc, tableStyle, defectRateData);
                            }

                            doc.save(
                                fileName ? `${fileName}_Smart_Sensing_Chart_Data.pdf` : 'Smart_Sensing_Chart_Data.pdf'
                            );
                        }
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
                imageExportContainerID = document.getElementById(REPORT_CONTAINER_ID);
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

function addProductionRateDataTableExcel(workbook, productionRateData) {
    // Add new Worksheet
    let worksheet = workbook.addWorksheet('Production_Rate_Data');

    let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
    let middleRightAlignment = {vertical: 'middle', horizontal: 'right'};

    worksheet.mergeCells('A1:K1');
    worksheet.getCell('A1').value = "PRODUCTION RATE";

    worksheet.getColumn('A').width = 14;
    worksheet.mergeCells('A2:A4');
    worksheet.getCell('A2').value = "DATE";

    worksheet.mergeCells('B2:J2');
    worksheet.getCell('B2').value = "SHIFT";

    worksheet.getRow(4).height = 34;

    worksheet.getColumn('K').width = 18;
    worksheet.mergeCells('K2:K4');
    worksheet.getCell('K2').value = "AVG. PRODUCTION\r\nRATE BY DATE";

    worksheet.mergeCells('B3:D3');
    worksheet.getCell('B3').value = "SHIFT 1";

    worksheet.getCell('B4').value = "Target";
    worksheet.getCell('C4').value = "Actual";
    worksheet.getColumn('D').width = 12;
    worksheet.getCell('D4').value = "Production\r\nRate";

    worksheet.mergeCells('E3:G3');
    worksheet.getCell('E3').value = "SHIFT 2";

    worksheet.getCell('E4').value = "Target";
    worksheet.getCell('F4').value = "Actual";
    worksheet.getColumn('G').width = 12;
    worksheet.getCell('G4').value = "Production\r\nRate";

    worksheet.mergeCells('H3:J3');
    worksheet.getCell('H3').value = "SHIFT 3";

    worksheet.getCell('H4').value = "Target";
    worksheet.getCell('I4').value = "Actual";
    worksheet.getColumn('J').width = 12;
    worksheet.getCell('J4').value = "Production\r\nRate";

    let startSummaryRow = 4 + productionRateData.length;

    worksheet.mergeCells(`A${startSummaryRow}:A${startSummaryRow + 1}`);
    worksheet.getCell(`A${startSummaryRow}`).value = "SUMMARY";

    worksheet.mergeCells(`B${startSummaryRow}:C${startSummaryRow}`);
    worksheet.getCell(`B${startSummaryRow}`).value = "TOTAL";

    worksheet.getCell(`D${startSummaryRow}`).value = "AVERAGE";

    worksheet.mergeCells(`E${startSummaryRow}:F${startSummaryRow}`);
    worksheet.getCell(`E${startSummaryRow}`).value = "TOTAL";

    worksheet.getCell(`G${startSummaryRow}`).value = "AVERAGE";

    worksheet.mergeCells(`H${startSummaryRow}:I${startSummaryRow}`);
    worksheet.getCell(`H${startSummaryRow}`).value = "TOTAL";

    worksheet.getCell(`J${startSummaryRow}`).value = "AVERAGE";

    worksheet.getCell(`K${startSummaryRow}`).value = "AVERAGE";

    for (let row = 1; row <= 4 + productionRateData.length + 1; ++row) {

        let currentRow = worksheet.getRow(row);

        for (let col = 1; col <= productionRateData[0].length; ++col) {
            currentRow.getCell(col).border = {
                top: row === 1 ? {style: 'thick'} : {style: 'thin'},
                left: col === 1 ? {style: 'thick'} : {style: 'thin'},
                bottom: row === 4 + productionRateData.length + 1 ? {style: 'thick'} : {style: 'thin'},
                right: col === productionRateData[0].length ? {style: 'thick'} : {style: 'thin'}
            };

            if (col > 1
                && ((row > 4 && row < 4 + productionRateData.length)
                    || (row > 4 + productionRateData.length))) {
                currentRow.getCell(col).alignment = middleRightAlignment;
            } else {
                currentRow.getCell(col).alignment = middleCenterAlignment;
            }

            if (row <= 4 || row >= 4 + productionRateData.length
                || col === 1 || col === productionRateData[0].length) {
                currentRow.getCell(col).font = {
                    bold: true
                }
            }
        }
    }

    worksheet.getCell('D4').alignment = {...middleCenterAlignment, wrapText: true};
    worksheet.getCell('G4').alignment = {...middleCenterAlignment, wrapText: true};
    worksheet.getCell('J4').alignment = {...middleCenterAlignment, wrapText: true};
    worksheet.getCell('K2').alignment = {...middleCenterAlignment, wrapText: true};

    productionRateData.forEach((rowData, index) => {
        if (index < productionRateData.length - 1) {
            let currentRow = worksheet.getRow(5 + index);
            rowData.forEach((value, index) => {
                currentRow.getCell(1 + index).value =
                    index !== 0 && (index % 3 === 0 || index === rowData.length - 1)
                        ? changeNumberFormat(value, '%')
                        : value;
            });
        } else {
            let currentRow = worksheet.getRow(5 + index + 1);
            rowData.forEach((value, index) => {
                if (index > 0) {
                    currentRow.getCell(1 + index).value =
                        index !== 0 && (index % 3 === 0 || index === rowData.length - 1)
                            ? changeNumberFormat(value, '%')
                            : value;
                }
            });
        }
    });
}

function addDefectRateDataTableExcel(workbook, defectRateData) {
    // Add new Worksheet
    let worksheet = workbook.addWorksheet('Defect_Rate_Data');

    let middleCenterAlignment = {vertical: 'middle', horizontal: 'center'};
    let middleRightAlignment = {vertical: 'middle', horizontal: 'right'};

    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = "DEFECT RATE";

    worksheet.mergeCells('A2:A3');
    worksheet.getCell('A2').value = "DATE";

    worksheet.mergeCells('B2:B3');
    worksheet.getCell('B2').value = "TYPE 1\r\nCOUNT";

    worksheet.mergeCells('C2:C3');
    worksheet.getCell('C2').value = "TYPE 2\r\nCOUNT";

    worksheet.mergeCells('D2:D3');
    worksheet.getCell('D2').value = "TYPE 3\r\nCOUNT";

    worksheet.mergeCells('E2:E3');
    worksheet.getCell('E2').value = "TYPE 4\r\nCOUNT";

    worksheet.mergeCells('F2:F3');
    worksheet.getCell('F2').value = "TOTAL COUNT\r\nBY DATE";

    worksheet.getCell(`A${3 + defectRateData.length}`).value = "TOTAL BY TYPE";

    for (let col = 1; col <= defectRateData[0].length; ++col) {
        worksheet.getColumn(col).width = 14
    }

    for (let row = 1; row <= 3 + defectRateData.length; ++row) {

        let currentRow = worksheet.getRow(row);

        for (let col = 1; col <= defectRateData[0].length; ++col) {
            currentRow.getCell(col).border = {
                top: row === 1 ? {style: 'thick'} : {style: 'thin'},
                left: col === 1 ? {style: 'thick'} : {style: 'thin'},
                bottom: row === 3 + defectRateData.length ? {style: 'thick'} : {style: 'thin'},
                right: col === defectRateData[0].length ? {style: 'thick'} : {style: 'thin'}
            };

            if (row > 3 && col > 1) {
                currentRow.getCell(col).alignment = middleRightAlignment;
            } else {
                currentRow.getCell(col).alignment = middleCenterAlignment;
            }

            if (row < 4 || row === 3 + defectRateData.length
                || col === 1 || col === defectRateData[0].length) {
                currentRow.getCell(col).font = {
                    bold: true
                }
            }
        }
    }

    worksheet.getCell('B2').alignment = {...middleCenterAlignment, wrapText: true};
    worksheet.getCell('C2').alignment = {...middleCenterAlignment, wrapText: true};
    worksheet.getCell('D2').alignment = {...middleCenterAlignment, wrapText: true};
    worksheet.getCell('E2').alignment = {...middleCenterAlignment, wrapText: true};
    worksheet.getCell('F2').alignment = {...middleCenterAlignment, wrapText: true};

    defectRateData.forEach((rowData, index) => {
        let currentRow = worksheet.getRow(4 + index);

        if (index < defectRateData.length - 1) {
            rowData.forEach((value, index) => {
                currentRow.getCell(1 + index).value = value;
            });
        } else {
            rowData.forEach((value, index) => {
                if (index > 0) {
                    currentRow.getCell(1 + index).value =
                        `${value} (${changeNumberFormat((value / rowData[rowData.length - 1]) * 100)}%)`;
                }
            });
        }
    });
}

function addStationStatusDataTablePDF(doc, tableStyle, stationStatusData) {
    let middleCenterStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'center',
    };

    let body = [
        {
            col1: {
                content: 'STATION STATUS',
                colSpan: 3,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: '',
            col3: '',
        },
        {
            col1: {
                content: 'STATION',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: 'STATUS',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: {
                content: 'TIME',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
        },
    ];

    stationStatusData.forEach((station) => {
        body.push({
            col1: {
                content: station[0],
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: station[1] === 1 ? 'On' : 'Off',
                styles: {
                    ...middleCenterStyle,
                },
            },
            col3: {
                content: station[2],
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

function addShiftStatusDataTablePDF(doc, tableStyle, shiftStatusData) {
    let middleRightStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'right',
    };
    let middleCenterStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'center',
    };

    let body = [
        {
            col1: {
                content: 'STATION STATUS',
                colSpan: 1 + shiftStatusData[0].length,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: '',
            col3: '',
            col4: '',
            col5: '',
            col6: '',
            col7: '',
            col8: '',
            col9: '',
            col10: '',
        },
        {
            col1: {
                content: 'SHIFT NO.',
                rowSpan: 2,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: 'STATION',
                colSpan: shiftStatusData[0].length - 1,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: '',
            col4: '',
            col5: '',
            col6: '',
            col7: '',
            col8: '',
            col9: '',
            col10: {
                content: 'TOTAL',
                rowSpan: 2,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
        },
        {
            col1: '',
            col2: {
                content: '1',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: {
                content: '2',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col4: {
                content: '3',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col5: {
                content: '4',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col6: {
                content: '5',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col7: {
                content: '6',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col8: {
                content: '7',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col9: {
                content: '8',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col10: '',
        },
    ];

    shiftStatusData.forEach((shiftData, index) => {
        body.push({
            col1: {
                content: index + 1,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: shiftData[0],
                styles: {
                    ...middleRightStyle,
                },
            },
            col3: {
                content: shiftData[1],
                styles: {
                    ...middleRightStyle,
                },
            },
            col4: {
                content: shiftData[2],
                styles: {
                    ...middleRightStyle,
                },
            },
            col5: {
                content: shiftData[3],
                styles: {
                    ...middleRightStyle,
                },
            },
            col6: {
                content: shiftData[4],
                styles: {
                    ...middleRightStyle,
                },
            },
            col7: {
                content: shiftData[5],
                styles: {
                    ...middleRightStyle,
                },
            },
            col8: {
                content: shiftData[6],
                styles: {
                    ...middleRightStyle,
                },
            },
            col9: {
                content: shiftData[7],
                styles: {
                    ...middleRightStyle,
                },
            },
            col10: {
                content: shiftData[8],
                styles: {
                    ...middleRightStyle,
                    fontStyle: 'bold',
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

function addDownTimeShiftDataTablePDF(doc, tableStyle, downTimeShiftData) {
    let middleRightStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'right',
    };
    let middleCenterStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'center',
    };

    let body = [
        {
            col1: {
                content: 'DOWN TIME BY SHIFT',
                colSpan: 1 + downTimeShiftData[0].length,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: '',
            col3: '',
            col4: '',
            col5: '',
            col6: '',
            col7: '',
            col8: '',
            col9: '',
            col10: '',
        },
        {
            col1: {
                content: 'SHIFT NO.',
                rowSpan: 2,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: 'STATION',
                colSpan: downTimeShiftData[0].length - 1,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: '',
            col4: '',
            col5: '',
            col6: '',
            col7: '',
            col8: '',
            col9: '',
            col10: {
                content: 'TOTAL',
                rowSpan: 2,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
        },
        {
            col1: '',
            col2: {
                content: '1',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: {
                content: '2',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col4: {
                content: '3',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col5: {
                content: '4',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col6: {
                content: '5',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col7: {
                content: '6',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col8: {
                content: '7',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col9: {
                content: '8',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col10: '',
        },
    ];

    downTimeShiftData.forEach((shiftData, index) => {
        body.push({
            col1: {
                content: index + 1,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: shiftData[0],
                styles: {
                    ...middleRightStyle,
                },
            },
            col3: {
                content: shiftData[1],
                styles: {
                    ...middleRightStyle,
                },
            },
            col4: {
                content: shiftData[2],
                styles: {
                    ...middleRightStyle,
                },
            },
            col5: {
                content: shiftData[3],
                styles: {
                    ...middleRightStyle,
                },
            },
            col6: {
                content: shiftData[4],
                styles: {
                    ...middleRightStyle,
                },
            },
            col7: {
                content: shiftData[5],
                styles: {
                    ...middleRightStyle,
                },
            },
            col8: {
                content: shiftData[6],
                styles: {
                    ...middleRightStyle,
                },
            },
            col9: {
                content: shiftData[7],
                styles: {
                    ...middleRightStyle,
                },
            },
            col10: {
                content: shiftData[8],
                styles: {
                    ...middleRightStyle,
                    fontStyle: 'bold',
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

function addProductionRateDataTablePDF(doc, tableStyle, productionRateData) {
    let middleRightStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'right',
    };
    let middleCenterStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'center',
    };

    let body = [
        {
            col1: {
                content: 'PRODUCTION RATE',
                colSpan: productionRateData[0].length,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: '',
            col3: '',
            col4: '',
            col5: '',
            col6: '',
            col7: '',
            col8: '',
            col9: '',
            col10: '',
            col11: '',
        },
        {
            col1: {
                content: 'DATE',
                rowSpan: 3,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: 'SHIFT',
                colSpan: productionRateData[0].length - 2,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: '',
            col4: '',
            col5: '',
            col6: '',
            col7: '',
            col8: '',
            col9: '',
            col10: '',
            col11: {
                content: 'AVG. PRODUCTION\r\nRATE BY DATE',
                rowSpan: 3,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
        },
        {
            col1: '',
            col2: {
                content: 'SHIFT 1',
                colSpan: 3,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: '',
            col4: '',
            col5: {
                content: 'SHIFT 2',
                colSpan: 3,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col6: '',
            col7: '',
            col8: {
                content: 'SHIFT 3',
                colSpan: 3,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col9: '',
            col10: '',
            col11: {
                content: 'AVG. PRODUCTION\r\nRATE BY DATE',
                rowSpan: 3,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
        },
        {
            col1: '',
            col2: {
                content: 'Target',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: {
                content: 'Actual',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col4: {
                content: 'Production\r\nRate',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col5: {
                content: 'Target',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col6: {
                content: 'Actual',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col7: {
                content: 'Production\r\nRate',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col8: {
                content: 'Target',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col9: {
                content: 'Actual',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col10: {
                content: 'Production\r\nRate',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col11: '',
        },
    ];

    productionRateData.forEach((rowData, index, array) => {
        if (index < array.length - 1) {
            body.push({
                col1: {
                    content: rowData[0],
                    styles: {
                        ...middleCenterStyle,
                        fontStyle: 'bold',
                    },
                },
                col2: {
                    content: rowData[1],
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col3: {
                    content: rowData[2],
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col4: {
                    content: `${rowData[3]}%`,
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col5: {
                    content: rowData[4],
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col6: {
                    content: rowData[5],
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col7: {
                    content: `${rowData[6]}%`,
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col8: {
                    content: rowData[7],
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col9: {
                    content: rowData[8],
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col10: {
                    content: `${rowData[9]}%`,
                    styles: {
                        ...middleRightStyle,
                    },
                },
                col11: {
                    content: `${rowData[10]}%`,
                    styles: {
                        ...middleRightStyle,
                        fontStyle: 'bold',
                    },
                },
            });
        }
    });

    body.push({
        col1: {
            content: 'SUMMARY',
            rowSpan: 2,
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
        col2: {
            content: 'TOTAL',
            colSpan: 2,
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
        col3: '',
        col4: {
            content: 'AVERAGE',
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
        col5: {
            content: 'TOTAL',
            colSpan: 2,
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
        col6: '',
        col7: {
            content: 'AVERAGE',
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
        col8: {
            content: 'TOTAL',
            colSpan: 2,
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
        col9: '',
        col10: {
            content: 'AVERAGE',
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
        col11: {
            content: 'AVERAGE',
            styles: {
                ...middleCenterStyle,
                fontStyle: 'bold',
            },
        },
    });

    let summaryData = productionRateData[productionRateData.length - 1];
    body.push({
        col1: '',
        col2: {
            content: summaryData[1],
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col3: {
            content: summaryData[2],
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col4: {
            content: changeNumberFormat(summaryData[3], '%'),
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col5: {
            content: summaryData[4],
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col6: {
            content: summaryData[5],
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col7: {
            content: changeNumberFormat(summaryData[6], '%'),
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col8: {
            content: summaryData[7],
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col9: {
            content: summaryData[8],
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col10: {
            content: changeNumberFormat(summaryData[9], '%'),
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
        col11: {
            content: changeNumberFormat(summaryData[10], '%'),
            styles: {
                ...middleRightStyle,
                fontStyle: 'bold',
            },
        },
    });

    // Add Table of Data
    doc.autoTable({
        body: body,
        theme: 'grid',
    });
}

function addDefectRateDataTablePDF(doc, tableStyle, defectRateData) {
    let middleRightStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'right',
    };
    let middleCenterStyle = {
        ...tableStyle,
        valign: 'middle',
        halign: 'center',
    };

    let body = [
        {
            col1: {
                content: 'DEFECT RATE',
                colSpan: defectRateData[0].length,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: '',
            col3: '',
            col4: '',
            col5: '',
            col6: '',
        },
        {
            col1: {
                content: 'DATE',
                rowSpan: 2,
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: 'TYPE 1\r\nCOUNT',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col3: {
                content: 'TYPE 2\r\nCOUNT',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col4: {
                content: 'TYPE 3\r\nCOUNT',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col5: {
                content: 'TYPE 4\r\nCOUNT',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col6: {
                content: 'TOTAL COUNT\r\nBY DATE',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
        },
    ];

    defectRateData.forEach((rowData, index, array) => {
        body.push({
            col1: {
                content: index < array.length - 1 ? rowData[0] : 'TOTAL BY TYPE',
                styles: {
                    ...middleCenterStyle,
                    fontStyle: 'bold',
                },
            },
            col2: {
                content: index < array.length - 1 ? rowData[1] : `${rowData[1]} (${changeNumberFormat((rowData[1] / rowData[5]) * 100, '%')})`,
                styles: {
                    ...middleRightStyle,
                    fontStyle: index < array.length - 1 ? 'normal' : 'bold',
                },
            },
            col3: {
                content: index < array.length - 1 ? rowData[2] : `${rowData[2]} (${changeNumberFormat((rowData[2] / rowData[5]) * 100, '%')})`,
                styles: {
                    ...middleRightStyle,
                    fontStyle: index < array.length - 1 ? 'normal' : 'bold',
                },
            },
            col4: {
                content: index < array.length - 1 ? rowData[3] : `${rowData[3]} (${changeNumberFormat((rowData[3] / rowData[5]) * 100, '%')})`,
                styles: {
                    ...middleRightStyle,
                    fontStyle: index < array.length - 1 ? 'normal' : 'bold',
                },
            },
            col5: {
                content: index < array.length - 1 ? rowData[4] : `${rowData[4]} (${changeNumberFormat((rowData[4] / rowData[5]) * 100, '%')})`,
                styles: {
                    ...middleRightStyle,
                    fontStyle: index < array.length - 1 ? 'normal' : 'bold',
                },
            },
            col6: {
                content: index < array.length - 1 ? rowData[5] : `${rowData[5]} (${changeNumberFormat((rowData[5] / rowData[5]) * 100, '%')})`,
                styles: {
                    ...middleRightStyle,
                    fontStyle: 'bold',
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
