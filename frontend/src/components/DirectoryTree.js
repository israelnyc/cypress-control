import React, { Component } from 'react';
import classNames from 'classnames';
import { faPlus, faMinus, faSync } from '@fortawesome/free-solid-svg-icons';
import Button from './UI/Button';
import ButtonBar from './UI/ButtonBar';
import Panel from './UI/Panel';

import styles from './DirectoryTree.module.css';

class DirectoryTree extends Component {
    static defaultProps = {
        data: [],
        dataURL: '',
        onSelectionChange: () => {},
        rendersCollapsed: false,
        isCaseSensitive: true,
        itemsHaveCheckboxes: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            directories: [],
            directoriesFlattened: [],
            directoryCount: 0,
            fileCount: 0,
            filterQuery: '',
            filteredFilesOrDirectories: [],
            selectedItems: [],
        };

        this.directoryPanels = {};
    }

    collapseAll = () => {
        Object.keys(this.directoryPanels).forEach(key => {
            this.directoryPanels[key].collapse();
        });
    };

    expandAll = () => {
        Object.keys(this.directoryPanels).forEach(key => {
            this.directoryPanels[key].expand();
        });
    };

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

    searchHandler = e => {
        const query = e.target.value;

        this.setState(
            {
                filterQuery: query,
                filteredFilesOrDirectories: [],
            },
            () => {
                if (query) {
                    this.filter(this.state.directories, query);
                }
            }
        );
    };

    getDirectoryItemByPath(directory, path) {
        let foundItem = null;

        for (let i = 0; i < directory.length; i++) {
            if (directory[i].path === path) {
                foundItem = directory[i];
                break;
            }

            if (!foundItem && directory[i].children) {
                foundItem = this.getDirectoryItemByPath(
                    directory[i].children,
                    path
                );
            }
        }

        return foundItem;
    }

    flattenDirectoryItem(directoryItem) {
        let items = [];

        if (Array.isArray(directoryItem)) {
            directoryItem.forEach(item => {
                items.push(item);

                if (item.children) {
                    items = items.concat(
                        this.flattenDirectoryItem(item.children)
                    );
                }
            });
        } else {
            items.push(directoryItem);
        }

        if (directoryItem.children) {
            items = items.concat(
                this.flattenDirectoryItem(directoryItem.children)
            );
        }

        return items;
    }

    itemCheckboxChangeHandler = e => {
        const { name, path, type } = e.target.dataset;
        const selectedItems = [...this.state.selectedItems];

        let directoryChildren = [];

        if (type === 'directory') {
            directoryChildren = this.flattenDirectoryItem(
                this.getDirectoryItemByPath(this.state.directories, path)
            ).map(directoryChild => directoryChild.path);
        }

        if (e.target.checked) {
            if (!this.state.selectedItems.includes(path)) {
                if (type === 'directory') {
                    selectedItems.push(
                        ...directoryChildren.filter(
                            path => !this.state.selectedItems.includes(path)
                        )
                    );
                }

                if (type === 'file') {
                    selectedItems.push(path);
                }

                this.setState({ selectedItems }, this.onSelectionChange);
            }
        } else {
            const pathIndex = selectedItems.indexOf(path);
            const parentDirectory = path.replace(`\\${name}`, '');

            selectedItems.splice(pathIndex, 1);

            if (type === 'directory') {
                directoryChildren.forEach(directoryChild => {
                    const directoryChildPathIndex =
                        selectedItems.indexOf(directoryChild);

                    if (directoryChildPathIndex > -1) {
                        selectedItems.splice(directoryChildPathIndex, 1);
                    }
                });
            } else {
                const parentDirectoryIndex =
                    selectedItems.indexOf(parentDirectory);

                if (parentDirectoryIndex > -1) {
                    selectedItems.splice(parentDirectoryIndex, 1);
                }
            }

            this.setState({ selectedItems }, this.onSelectionChange);
        }
    };

    onSelectionChange = () => {
        this.props.onSelectionChange(this);
    };

    renderTreeItem = item => {
        return (
            <div className={styles.tree_item_wrapper}>
                {this.props.itemsHaveCheckboxes && (
                    <input
                        type='checkbox'
                        checked={this.state.selectedItems.includes(item.path)}
                        onClick={e => e.stopPropagation()}
                        onChange={this.itemCheckboxChangeHandler}
                        data-name={item.name}
                        data-path={item.path}
                        data-type={item.type}
                    />
                )}
                <div>{item.name}</div>
            </div>
        );
    };

    buildDirectoryBlock(directory, isRootDirectory = false) {
        return directory.map(item => {
            const tree = [];
            const key = item.path;

            const { filterQuery, filteredFilesOrDirectories } = this.state;

            const matchesFilter =
                !filterQuery ||
                isRootDirectory ||
                filteredFilesOrDirectories.includes(item.name);

            if (item.type === 'directory') {
                tree.push(
                    <Panel
                        ref={panel => (this.directoryPanels[key] = panel)}
                        classNames={{
                            panel: classNames({
                                hidden: !matchesFilter,
                                [styles.directory]: true,
                            }),
                            content: styles.directory_content,
                        }}
                        key={key}
                        title={this.renderTreeItem(item)}
                        content={this.buildDirectoryBlock(item.children)}
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
                        {this.renderTreeItem(item)}
                    </div>
                );
            }

            return tree;
        });
    }

    onDataReady = data => {
        const directoriesFlattened = this.flattenDirectoryItem(data);
        const directories = directoriesFlattened.filter(
            item => item.type === 'directory'
        );
        const files = directoriesFlattened.filter(item => item.type === 'file');

        this.setState({
            directories: data,
            directoriesFlattened,
            directoryCount: directories.length,
            fileCount: files.length,
        });
    };

    refreshData = () => {
        if (this.props.dataURL) {
            fetch(this.props.dataURL)
                .then(response => response.json())
                .then(data => this.onDataReady(data))
                .catch(e => console.error(e));
        } else {
            this.onDataReady(this.props.data);
        }
    };

    componentDidMount() {
        this.refreshData();

        if (this.props.rendersCollapsed) {
            this.collapseAll();
        }
    }

    render() {
        const directories = this.buildDirectoryBlock(
            this.state.directories,
            true
        );

        const controlBar = (
            <header className={styles.control_bar}>
                <div className={styles.search_bar_wrapper}>
                    <input
                        placeholder='Search'
                        type='text'
                        className={styles.search_bar}
                        onKeyUp={this.searchHandler}
                    />
                </div>

                <ButtonBar className={styles.buttons}>
                    <Button
                        className={{
                            container: styles.button,
                        }}
                        title='Expand All'
                        onClick={this.expandAll}
                        icon={faPlus}
                    />
                    <Button
                        className={{
                            container: styles.button,
                        }}
                        title='Collapse All'
                        onClick={this.collapseAll}
                        icon={faMinus}
                    />
                    <Button
                        className={{
                            container: styles.button,
                        }}
                        title='Refresh'
                        onClick={this.refreshData}
                        icon={faSync}
                    />
                </ButtonBar>
            </header>
        );

        return (
            <Panel
                classNames={{ panel: classNames(styles.container) }}
                isCollapsible={false}
                title={controlBar}
                content={directories}
            />
        );
    }
}

export default DirectoryTree;
