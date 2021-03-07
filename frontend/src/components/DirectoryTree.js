import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Panel from './Panel';
import styles from './DirectoryTree.module.css';
import classNames from 'classnames';

class DirectoryTree extends Component {
    static defaultProps = {
        data: [],
        dataURL: '',
        rendersCollapsed: false,
        isCaseSensitive: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            directories: [],
            filterQuery: '',
            filteredFilesOrDirectories: [],
            isTreeCollapsed: false,
        };

        this.collapseAll = this.collapseAll.bind(this);
        this.expandAll = this.expandAll.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
    }

    collapseAll() {
        this.setState({
            isTreeCollapsed: true,
        });
    }

    expandAll() {
        this.setState({
            isTreeCollapsed: false,
        });
    }

    filter(data, query, parentDirectory = '') {
        data.forEach(item => {
            const _query = this.props.isCaseSensitive
                ? query
                : query.toLowerCase();
            const _itemName = this.props.isCaseSensitive
                ? item.name
                : item.name.toLowerCase();

            if (_itemName.indexOf(_query) > -1) {
                if (
                    !this.state.filteredFilesOrDirectories.includes(item.name)
                ) {
                    this.setState(state => {
                        return {
                            filteredFilesOrDirectories: [
                                ...state.filteredFilesOrDirectories,
                                ...parentDirectory.split('/'),
                                item.name,
                            ],
                        };
                    });
                }
            }

            if (item.children) {
                this.filter(
                    item.children,
                    query,
                    `${parentDirectory}/${item.name}`
                );
            }
        });
    }

    searchHandler(e) {
        const query = e.target.value;

        this.setState(
            {
                filteredFilesOrDirectories: [],
                filterQuery: query,
            },
            () => {
                if (query) {
                    this.filter(this.state.directories, query);
                }
            }
        );
    }

    buildDirectoryBlock(directory, isRootDirectory) {
        return directory.map(item => {
            const tree = [];
            const key = Math.floor(Math.random() * 10000);

            const {
                filterQuery,
                filteredFilesOrDirectories,
                isTreeCollapsed,
            } = this.state;

            const matchesFilter =
                !filterQuery ||
                isRootDirectory ||
                filteredFilesOrDirectories.includes(item.name);

            if (item.type === 'directory') {
                tree.push(
                    <Panel
                        classNames={{
                            panel: classNames({
                                hidden: !matchesFilter,
                                [styles.directory]: true,
                            }),
                            content: styles.content,
                        }}
                        key={key}
                        rendersCollapsed={isTreeCollapsed}
                        title={item.name}
                        content={this.buildDirectoryBlock(
                            item.children,
                            false,
                            item.name
                        )}
                    />
                );
            }

            if (item.type === 'file') {
                tree.push(
                    <div
                        key={key}
                        className={classNames({
                            [styles.file]: true,
                            hidden: !matchesFilter,
                        })}>
                        {item.name}
                    </div>
                );
            }

            return tree;
        });
    }

    componentDidMount() {
        if (this.props.dataURL) {
            fetch(this.props.dataURL)
                .then(response => response.json())
                .then(data => this.setState({ directories: data }));
        } else {
            this.setState({ directories: this.props.data });
        }

        if (this.props.rendersCollapsed) {
            this.setState({
                isTreeCollapsed: true,
            });
        }
    }

    render() {
        const directories = this.buildDirectoryBlock(
            this.state.directories,
            true
        );

        const controlBar = () => {
            return (
                <header className={styles.control_bar}>
                    <div className={styles.search_bar_wrapper}>
                        <input
                            placeholder='Search'
                            type='text'
                            className={styles.search_bar}
                            onKeyUp={this.searchHandler}
                        />
                    </div>

                    <div className={styles.buttons}>
                        <div
                            className={styles.button}
                            title='Collapse All'
                            onClick={this.collapseAll}>
                            <FontAwesomeIcon icon={faMinus} />
                        </div>
                        <div
                            className={styles.button}
                            title='Expand All'
                            onClick={this.expandAll}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                    </div>
                </header>
            );
        };

        return (
            <Panel
                isCollapsible={false}
                title={controlBar()}
                content={directories}
            />
        );
    }
}

export default DirectoryTree;
