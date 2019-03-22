import React, {Component} from 'react';
import {Collapse, ListGroup, ListGroupItem} from 'reactstrap';
import DataExporter from "../../DataExporter/component/DataExporter";
import {
    ExportType,
    MODEL_NAMES,
    ROUTE,
    SHIFT_OPTIONS,
    ARTICLE_NAMES,
    MODEL_NAMES_BY_ARTICLE, MODELS_BY_ARTICLE
} from "../../../constants/constants";
import Filter from "../../../shared/img/Filter.svg";
import {connect} from "react-redux";
import {changeGlobalShiftFilter} from "../../../redux/actions/globalShiftFilterActions";
import {withRouter} from "react-router-dom";
import API from "../../../services/api";
import {changeGlobalModelFilter} from "../../../redux/actions/globalModelFilterActions";
import {changeGlobalArticleFilter} from "../../../redux/actions/globalArticleActions";
import {changeGlobalModelsByArticleFilter} from "../../../redux/actions/globalModelsByArticleFilterActions";

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
            articleFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
            selectedModels: MODEL_NAMES,
            selectedModelsByArticle: MODELS_BY_ARTICLE,
            selectedArticles: ARTICLE_NAMES,
            selectedShifts: selectedShifts,
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.requestModelTypesForFiltering();

        this.requestArticleList();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
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
            modelsByArticleFilterMenuOpen: false,
            articleFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
        });
    };

    onModelsByArticleFilterMenuClicked = () => {
        this.setState({
            modelsByArticleFilterMenuOpen: !this.state.modelsByArticleFilterMenuOpen,
            modelFilterMenuOpen: false,
            articleFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
        });
    };

    onArticleFilterMenuClicked = () => {
        this.setState({
            articleFilterMenuOpen: !this.state.articleFilterMenuOpen,
            modelsByArticleFilterMenuOpen: false,
            modelFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: false,
        });
    };

    onArticleItemClicked = (event) => {
        let item = event.target.innerText;
        let selectedArticle = [item];

        let selectedArticles = this.state.selectedArticles;
        selectedArticles.forEach((value, key) => {
            value.selected = key === item;

            if (key === item) {
                selectedArticle.push(value);
            }
        });
        this.setState({
            selectedArticles: selectedArticles
        });
        console.log("selectedArticles: ", selectedArticles);
        this.getModelTypesByArticle(selectedArticle[0]);
        this.props.dispatch(
            changeGlobalModelFilter(selectedArticle)
        );
    };

    onModelItemClicked = (event) => {
        let item = event.target.innerText;
        let selectedModel = [item];

        let selectedModels = this.state.selectedModels;
        selectedModels.forEach((value, key) => {
            value.selected = key === item;

            if (key === item) {
                selectedModel.push(value);
            }
        });
        this.setState({
            selectedModels: selectedModels
        });
        this.props.dispatch(
            changeGlobalModelFilter(selectedModel)
        );
    };

    onModelsByArticleItemClicked = (event) => {
        let item = event.target.innerText;
        let selectedModelsByArticle = [item];

        let selectedModelsByArticles = this.state.selectedModelsByArticle;
        selectedModelsByArticles.forEach((value, key) => {
            value.selected = key === item;

            if (key === item) {
                selectedModelsByArticle.push(value);
            }
        });
        console.log("155 155");
        console.log("155 155");
        console.log("selectedModelsByArticles: ", selectedModelsByArticles);
        console.log("selectedModelsByArticle: ", selectedModelsByArticle);
        this.setState({
            selectedModelsByArticles: selectedModelsByArticles
        });
        this.props.dispatch(
            changeGlobalModelsByArticleFilter(selectedModelsByArticle)
        );
    };

    onShiftFilterMenuClicked = () => {
        this.setState({
            modelsByArticleFilterMenuOpen: false,
            modelFilterMenuOpen: false,
            articleFilterMenuOpen: false,
            shiftFilterMenuOpen: !this.state.shiftFilterMenuOpen,
            downloadMenuOpen: false,
        });
    };

    onShiftItemClicked = (event) => {
        let item = event.target.innerText;
        let selectedShifts = this.state.selectedShifts;
        selectedShifts.forEach((value, key, map) => {
            if (key !== item) {
                map.set(key, false);
            } else {
                map.set(key, true);
            }
        });
        this.setState({
            selectedShifts: selectedShifts
        });
        this.props.dispatch(
            changeGlobalShiftFilter(item)
        );
    };

    onDownloadMenuClicked = () => {
        this.setState({
            articleFilterMenuOpen: false,
            modelsByArticleFilterMenuOpen: false,
            modelFilterMenuOpen: false,
            shiftFilterMenuOpen: false,
            downloadMenuOpen: !this.state.downloadMenuOpen
        });
    };

    getModelTypesByArticle = (articleNo) => {
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;

        let link = 'api/ip/moldNameByArticle';
        switch (this.role) {
            case 'admin':
                link = 'api/os/moldNameByArticle';
                break;
            case 'ip':
                link = 'api/ip/moldNameByArticle';
                break;
            case 'os':
                link = 'api/os/moldNameByArticle';
                break;
        }

        let param = {
            "article_no": articleNo
        };
        API(link, 'POST', param)
            .then((response) => {
                if (response.data.success) {
                    console.log("dataArray: ", response);
                    let dataArray = response.data.data;
                    if (dataArray) {
                        let allModelsByArticleSet = MODELS_BY_ARTICLE.entries().next().value;  // Get 'All Models' option
                        MODELS_BY_ARTICLE.clear();
                        MODELS_BY_ARTICLE.set(allModelsByArticleSet[0], allModelsByArticleSet[1]);
                        dataArray.forEach(element => {
                            MODELS_BY_ARTICLE.set(
                                element.value,
                                {
                                    key: element.key,
                                    selected: false,
                                }
                            );
                        });

                        if (MODELS_BY_ARTICLE.size > 0) {
                            MODELS_BY_ARTICLE.values().next().value.selected = true;
                        }

                        this.setState({
                            selectedModelsByArticle: MODELS_BY_ARTICLE,
                        });

                        this.props.dispatch(
                            changeGlobalModelFilter(allModelsByArticleSet)
                        );
                    } else {
                        let allModelsByArticleSet = MODELS_BY_ARTICLE.entries().next().value;  // Get 'All Models' option
                        MODELS_BY_ARTICLE.clear();
                        MODELS_BY_ARTICLE.set(allModelsByArticleSet[0], allModelsByArticleSet[1]);
                    }
                } else {
                    let allModelsByArticleSet = MODELS_BY_ARTICLE.entries().next().value;  // Get 'All Models' option
                    MODELS_BY_ARTICLE.clear();
                    MODELS_BY_ARTICLE.set(allModelsByArticleSet[0], allModelsByArticleSet[1]);
                }
            })
            .catch((err) => console.log('err: ', err));
    }

    requestModelTypesForFiltering = () => {
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
        API(`api/${link}/modelName`, 'POST', {})
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
                            selectedModels: MODEL_NAMES,
                        });

                        this.props.dispatch(
                            changeGlobalModelFilter(allModelsSet)
                        );
                    }
                }
            })
            .catch((err) => console.log('err: ', err));
    };

    requestArticleList = () => {
        this.loginData = JSON.parse(localStorage.getItem('logindata'));
        this.role = this.loginData.data.role;

        let link = 'api/os/article';
        switch (this.role) {
            case 'admin':
                link = 'api/os/article';
                break;
            case 'ip':
                link = 'api/ip/article';
                break;
            case 'os':
                link = 'api/os/article';
                break;
        }
        API(link, 'POST', {})
            .then((response) => {
                if (response.data.success) {
                    let dataArray = response.data.data;

                    if (dataArray) {
                        let allArticlesSet = ARTICLE_NAMES.entries().next().value;  // Get 'All
                        // Articles' option
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
                            selectedArticles: ARTICLE_NAMES,
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
                modelsByArticleFilterMenuOpen: false,
                modelFilterMenuOpen: false,
                articleFilterMenuOpen: false,
                shiftFilterMenuOpen: false,
                downloadMenuOpen: false
            });
        }
    }

    render() {
        let {location} = this.props;

        let articlesList = [];
        if (ARTICLE_NAMES && ARTICLE_NAMES.size > 0) {
            ARTICLE_NAMES.forEach((object, name) => {
                articlesList.push(name);
            });
        }

        let modelsByArticleList = [];
        if (MODELS_BY_ARTICLE && MODELS_BY_ARTICLE.size > 0) {
            MODELS_BY_ARTICLE.forEach((object, name) => {
                modelsByArticleList.push(name);
            });
        }

        let modelList = [];
        if (MODEL_NAMES && MODEL_NAMES.size > 0) {
            MODEL_NAMES.forEach((object, name) => {
                modelList.push(name);
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
                            location.pathname === ROUTE.Analysis || location.pathname === ROUTE.Dashboard // Only show
                                // Filter by
                                // Article
                                // Menu on Report Page
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
                                                    articlesList.map((name, index) => {
                                                        let articleClassName = 'list-item__unchecked';
                                                        let article = this.state.selectedArticles.get(name);
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
                            location.pathname === ROUTE.Analysis || location.pathname === ROUTE.Dashboard // Only show Filter by
                                // Model & Shift Menu on Report Page
                                ? (
                                    <span>
                                        <button className="btn btn-secondary"
                                                onClick={this.onModelsByArticleFilterMenuClicked}>
                                            Filter: Model <i className="fas fa-caret-down"></i>
                                        </button>
                                        <Collapse isOpen={this.state.modelsByArticleFilterMenuOpen}
                                                  className="topbar__menu-wrap">
                                            <ListGroup>
                                                {
                                                    modelsByArticleList.map((name, index) => {
                                                        let modelsByArticleClassName = 'list-item__unchecked';
                                                        let model = this.state.selectedModelsByArticle.get(name);
                                                        if (model && model.selected) {
                                                            modelsByArticleClassName = 'list-item__checked';
                                                        }
                                                        return <ListGroupItem key={index}
                                                                              className={modelsByArticleClassName}
                                                                              onClick={this.onModelsByArticleItemClicked}>
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
                            location.pathname === ROUTE.Report // Only show Filter by
                                // Model & Shift Menu on Report Page
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
                                                    modelList.map((name, index) => {
                                                        let modelClassName = 'list-item__unchecked';
                                                        let model = this.state.selectedModels.get(name);
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
                                                        if (this.state.selectedShifts.get(shift)) {
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
                            <div className="col-12">
                                <DataExporter exportType={ExportType.EXCEL}/>
                                <DataExporter exportType={ExportType.PDF}/>
                                <DataExporter exportType={ExportType.PNG}/>
                            </div>
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    globalModelFilter: state.globalModelFilter,
    globalShiftFilter: state.globalShiftFilter,
    globalArticleFilter: state.globalArticleFilter,

});

export default withRouter(connect(mapStateToProps)(TopbarFilter));
