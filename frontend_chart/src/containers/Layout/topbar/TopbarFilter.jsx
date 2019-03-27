import React, {Component} from 'react';
import {Collapse, ListGroup, ListGroupItem} from 'reactstrap';
import DataExporter from "../../DataExporter/component/DataExporter";
import {ARTICLE_NAMES, ExportType, MODEL_NAMES, REPORT_TABS, ROUTE, SHIFT_OPTIONS} from "../../../constants/constants";
import Filter from "../../../shared/img/Filter.svg";
import {connect} from "react-redux";
import {changeGlobalShiftFilter} from "../../../redux/actions/globalShiftFilterActions";
import {withRouter} from "react-router-dom";
import API from "../../../services/api";
import {changeGlobalModelFilter} from "../../../redux/actions/globalModelFilterActions";
import {changeGlobalArticleFilter} from "../../../redux/actions/globalArticleActions";
import moment from "moment";

class TopbarFilter extends Component {
    constructor(props) {
        super(props);

        let selectedShifts = new Map([
            [SHIFT_OPTIONS[0], false],
            [SHIFT_OPTIONS[1], false],
            [SHIFT_OPTIONS[2], false],
            [SHIFT_OPTIONS[3], false],
        ]);

        selectedShifts.forEach((value, key, map) => {
            if (key === props.globalShiftFilter.selectedShift) {
                map.set(key, true);
            }
        });

        this.state = {
            filterMenuOpen: false,
            modelFilterMenuOpen: false,
            modelMap: MODEL_NAMES,
            articleFilterMenuOpen: false,
            articleMap: ARTICLE_NAMES,
            shiftFilterMenuOpen: false,
            shiftMap: selectedShifts,
            downloadMenuOpen: false,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        switch (this.props.location.pathname) {
            case ROUTE.Dashboard:
                this.requestModelNamesForFiltering('modelName');
                break;
            case ROUTE.Analysis:
                this.requestModelNamesForFiltering('modelName');
                break;
            case ROUTE.Report:
                let param = {
                    from_workdate: moment(this.props.globalDateFilter.startDate.toISOString()).format("YYYYMMDD"),
                    to_workdate: moment(this.props.globalDateFilter.endDate.toISOString()).format("YYYYMMDD"),
                };
                this.requestModelNamesForFiltering('modelNameForReport', param);
                break;
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location != prevProps.location) {
            switch (this.props.location.pathname) {
                case ROUTE.Dashboard:
                    this.requestModelNamesForFiltering('modelName');
                    break;
                case ROUTE.Analysis:
                    this.requestModelNamesForFiltering('modelName');
                    break;
                case ROUTE.Report:
                    let param = {
                        from_workdate: moment(this.props.globalDateFilter.startDate.toISOString()).format("YYYYMMDD"),
                        to_workdate: moment(this.props.globalDateFilter.endDate.toISOString()).format("YYYYMMDD"),
                    };
                    this.requestModelNamesForFiltering('modelNameForReport', param);
                    break;
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    onFilterMenuClicked = () => {
        this.setState({
            filterMenuOpen: !this.state.filterMenuOpen
        });
    };

    onModelFilterMenuClicked = () => {
        this.setState({
            modelFilterMenuOpen: !this.state.modelFilterMenuOpen,
            articleFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
        });
    };

    onModelItemClicked = (event) => {
        let item = event.target.innerText;
        let currentSelectedModel = [item];

        let modelMap = this.state.modelMap;
        let modelKey = modelMap.get(item).key;
        modelMap.forEach((value, key) => {
            value.selected = key === item;

            if (key === item) {
                currentSelectedModel.push(value);
            }
        });
        this.setState({
            modelMap: modelMap
        });
        this.props.dispatch(
            changeGlobalModelFilter(currentSelectedModel)
        );
        this.requestArticleNamesByModelForFiltering(modelKey);
    };

    onArticleFilterMenuClicked = () => {
        this.setState({
            modelFilterMenuOpen: false,
            articleFilterMenuOpen: !this.state.articleFilterMenuOpen,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
        });
    };

    onArticleItemClicked = (event) => {
        let item = event.target.innerText;
        let currentSelectedArticle = [item];

        let articleMap = this.state.articleMap;
        articleMap.forEach((value, key) => {
            value.selected = key === item;

            if (key === item) {
                currentSelectedArticle.push(value);
            }
        });
        this.setState({
            articleMap: articleMap
        });
        this.props.dispatch(
            changeGlobalArticleFilter(currentSelectedArticle)
        );
    };

    onShiftFilterMenuClicked = () => {
        this.setState({
            modelFilterMenuOpen: false,
            articleFilterMenuOpen: false,
            shiftFilterMenuOpen: !this.state.shiftFilterMenuOpen,
            downloadMenuOpen: false,
        });
    };

    onShiftItemClicked = (event) => {
        let item = event.target.innerText;
        let shiftMap = this.state.shiftMap;
        shiftMap.forEach((value, key, map) => {
            if (key !== item) {
                map.set(key, false);
            } else {
                map.set(key, true);
            }
        });
        this.setState({
            shiftMap: shiftMap
        });
        this.props.dispatch(
            changeGlobalShiftFilter(item)
        );
    };

    onDownloadMenuClicked = () => {
        this.setState({
            modelFilterMenuOpen: false,
            articleFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: !this.state.downloadMenuOpen
        });
    };

    requestModelNamesForFiltering = (modelNameURL, param) => {
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;

        let link = 'ip';
        switch (this.role) {
            case 'admin':
                link = 'os';
                break;
            case 'ip':
                link = 'ip';
                break;
            case 'os':
                link = 'os';
                break;
        }
        API(`api/${link}/${modelNameURL}`, 'POST', param ? param : {})
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    if (dataArray) {
                        let allModelsSet = MODEL_NAMES.entries().next().value;  // Get 'All Models' option
                        MODEL_NAMES.clear();
                        MODEL_NAMES.set(allModelsSet[0], allModelsSet[1]);

                        dataArray.forEach(element => {
                            MODEL_NAMES.set(
                                element.value,
                                {
                                    key: element.key,
                                    selected: false,
                                }
                            );
                        });

                        if (MODEL_NAMES.size > 0) {
                            MODEL_NAMES.values().next().value.selected = true;
                        }

                        this.setState({
                            modelMap: MODEL_NAMES,
                        });

                        this.props.dispatch(
                            changeGlobalModelFilter(allModelsSet)
                        );
                    }
                }
            })
            .catch((err) => console.log('err: ', err));
    };

    requestArticleNamesByModelForFiltering = (modelKey) => {
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;

        let link = 'api/os/articleByModelName';
        switch (this.role) {
            case 'admin':
                link = 'api/os/articleByModelName';
                break;
            case 'ip':
                link = 'api/ip/articleByModelName';
                break;
            case 'os':
                link = 'api/os/articleByModelName';
                break;
        }
        let param = {
            model_name: modelKey
        };
        API(link, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    if (dataArray) {
                        let allArticlesSet = ARTICLE_NAMES.entries().next().value;  // Get 'All Articles' option
                        ARTICLE_NAMES.clear();
                        ARTICLE_NAMES.set(allArticlesSet[0], allArticlesSet[1]);

                        dataArray.forEach(element => {
                            ARTICLE_NAMES.set(
                                element.value,
                                {
                                    key: element.key,
                                    selected: false,
                                }
                            );
                        });

                        if (ARTICLE_NAMES.size > 0) {
                            ARTICLE_NAMES.values().next().value.selected = true;
                        }

                        this.setState({
                            articleMap: ARTICLE_NAMES,
                        });

                        this.props.dispatch(
                            changeGlobalArticleFilter(allArticlesSet)
                        );
                    }
                }
            })
            .catch((err) => console.log('err: ', err));
    };

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                filterMenuOpen: false,
                modelFilterMenuOpen: false,
                articleFilterMenuOpen: false,
                shiftFilterMenuOpen: false,
                downloadMenuOpen: false
            });
        }
    }

    render() {
        let {location} = this.props;

        let modelList = [];
        if (this.state.modelMap && this.state.modelMap.size > 0) {
            this.state.modelMap.forEach((object, name) => {
                modelList.push(name);
            });
        }

        let articleList = [];
        if (this.state.articleMap && this.state.articleMap.size > 0) {
            this.state.articleMap.forEach((object, name) => {
                articleList.push(name);
            });
        }

        return (
            <div className="topbar__profile" ref={this.setWrapperRef}>
                <button className="topbar__avatar" onClick={this.onFilterMenuClicked}>
                    <img src={Filter}/>
                </button>
                <Collapse isOpen={this.state.filterMenuOpen} className="topbar__menu-wrap">
                    <div className="topbar_filter_menu">
                        {
                            // Only show Filter by Model Menu on Report Page when Productivity Tab is selected
                            this.props.reportSelectedTab.selectedTab === REPORT_TABS[0]
                                ? (
                                    <span>
                                        <button className="btn btn-secondary"
                                                onClick={this.onModelFilterMenuClicked}>
                                            Filter: Model <i className="fas fa-caret-down"></i>
                                        </button>
                                        <Collapse isOpen={this.state.modelFilterMenuOpen}
                                                  className="topbar__menu-wrap">
                                            <ListGroup>
                                                {
                                                    modelList.map((name, index) => {    // Show Filter by Model Menu on All Pages
                                                        let modelClassName = 'list-item__unchecked';
                                                        let model = this.state.modelMap.get(name);
                                                        if (model && model.selected) {
                                                            modelClassName = 'list-item__checked';
                                                        }
                                                        return <ListGroupItem key={index}
                                                                              className={modelClassName}
                                                                              onClick={this.onModelItemClicked}>
                                                            {name}
                                                        </ListGroupItem>;
                                                    })
                                                }
                                            </ListGroup>
                                        </Collapse>
                                    </span>
                                )
                                : null
                        }
                        {
                            // Only show Filter by Article Menu on Report Page when Productivity Tab is selected
                            this.props.reportSelectedTab.selectedTab === REPORT_TABS[0]
                                ? (
                                    <span>
                                        <button className="btn btn-secondary"
                                                onClick={this.onArticleFilterMenuClicked}>
                                            Filter: Article <i className="fas fa-caret-down"></i>
                                        </button>
                                        <Collapse isOpen={this.state.articleFilterMenuOpen}
                                                  className="topbar__menu-wrap">
                                            <ListGroup className="listgroup__scroll">
                                                {
                                                    articleList.map((name, index) => {
                                                        let articleClassName = 'list-item__unchecked';
                                                        let article = this.state.articleMap.get(name);
                                                        if (article && article.selected) {
                                                            articleClassName = 'list-item__checked';
                                                        }
                                                        return <ListGroupItem key={index}
                                                                              className={articleClassName}
                                                                              onClick={this.onArticleItemClicked}>
                                                            {name}
                                                        </ListGroupItem>;
                                                    })
                                                }
                                            </ListGroup>
                                        </Collapse>
                                    </span>
                                )
                                : null
                        }
                        {
                            // Only show Filter by Shift Menu on Report & Analysis Page
                            location.pathname === ROUTE.Report || location.pathname === ROUTE.Analysis
                                ? (
                                    <span>
                                        <button className="btn btn-secondary"
                                                onClick={this.onShiftFilterMenuClicked}>
                                            Filter: Shift <i className="fas fa-caret-down"></i>
                                        </button>
                                        <Collapse isOpen={this.state.shiftFilterMenuOpen}
                                                  className="topbar__menu-wrap">
                                            <ListGroup>
                                                {
                                                    SHIFT_OPTIONS.map((shift, index) => {
                                                        let shiftClassName = 'list-item__unchecked';
                                                        if (this.state.shiftMap.get(shift)) {
                                                            shiftClassName = 'list-item__checked';
                                                        }
                                                        return <ListGroupItem key={index}
                                                                              className={shiftClassName}
                                                                              onClick={this.onShiftItemClicked}>
                                                            {shift}
                                                        </ListGroupItem>;
                                                    })
                                                }
                                            </ListGroup>
                                        </Collapse>
                                    </span>
                                )
                                : null
                        }
                        <button className="btn btn-secondary" onClick={this.onDownloadMenuClicked}>
                            Download <i className="fas fa-caret-down"></i>
                        </button>
                        <Collapse isOpen={this.state.downloadMenuOpen}
                                  className="topbar__menu-wrap">
                            <div className="bg-white container border align-content-center"
                                 style={{marginLeft: 40, width: 220,}}>
                                <div className="row">
                                    <DataExporter exportType={ExportType.EXCEL}/>
                                    <DataExporter exportType={ExportType.PDF}/>
                                    <DataExporter exportType={ExportType.PNG}/>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    reportSelectedTab: state.reportSelectedTab,
    globalDateFilter: state.globalDateFilter,
    globalModelFilter: state.globalModelFilter,
    globalArticleFilter: state.globalArticleFilter,
    globalShiftFilter: state.globalShiftFilter,
});

export default withRouter(connect(mapStateToProps)(TopbarFilter));
