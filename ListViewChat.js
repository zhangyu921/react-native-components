/**
 * 类似微信聊天界面，列表功能的RN实现
 * ！！：需要注意数据data，期待按时间降序排列(最新的信息在0位）
 * @author zhangyu921 <zhyuz@outlook.com>
 * @License MIT
 */

import React, { Component, PropTypes } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

class ListViewChat extends Component {

    static propTypes = {
        ...FlatList.propTypes,
        onGetOlderData: PropTypes.func, //获取历史数据
        offSet: PropTypes.number // 如出现抖动可适当调大，默认15
    };

    constructor (p) {
        super(p);
        this.state = {
            isScaledList: false
        };
        this.listMaxContentHeight = 0;
        this.listContentHeight = 0;
    }

    componentWillReceiveProps (nextProps) {
        // if (nextProps.data.length > 20) {
        //     this.setState({isScaledList: true});
        // }
    }

    getIsScaled = () => {
        return this.state.isScaledList;
    };

    scrollToLatest = () => {
        if (this.state.isScaledList) {
            this.list.scrollToIndex({viewPosition: 0, index: 0});
        }
    };

    _onContentSizeChange = (w, h) => {
        if (h) {this.listContentHeight = h;}
        this._checkToScaleList();
    };

    _onLayout = event => {
        this.listMaxContentHeight = event.nativeEvent.layout.height;
        this._checkToScaleList();
    };

    _scaleList = (bool) => {
        this.setState(() => ({isScaledList: bool}));
    };

    _checkToScaleList = () => {
        let shouldScale;
        if (this.listContentHeight > this.listMaxContentHeight + (this.props.offSet || 15)) {
            shouldScale = true;
        } else if (this.listContentHeight < this.listMaxContentHeight - (this.props.offSet || 15)) {
            shouldScale = false;
        } else {
            return;
        }
        if (shouldScale !== this.state.isScaledList) {
            this._scaleList(shouldScale);
        }
    };

    _renderItem = (props) => {
        return (
            <View style={[
                this.state.isScaledList
                    ? styles.scale
                    : {}
            ]}>
                {this.props.renderItem(props)}
            </View>
        );
    };

    render () {
        const {
            style,
            data,
            onEndReached,
            onRefresh,
            refreshing,
            onEndReachedThreshold = 0.3,
            keyExtractor,
            onScroll,
        } = this.props;

        let realData = [];

        if (!this.state.isScaledList) {
            for (let i = 0; i < data.length; i++) {
                realData.unshift(data[i]);
            }
        } else {
            realData = data;
        }

        let refreshingProp = this.state.isScaledList
            ? {
                onEndReached: this.props.onGetOlderData,
                onEndReachedThreshold,
                ListFooterComponent: () => refreshing
                    && <ActivityIndicator color="#999999"/>
            }
            : {
                onRefresh: this.props.onGetOlderData,
                refreshing,
            };

        return (
            <FlatList
                ref={ele => this.list = ele}
                style={[
                    styles.list,
                    style,
                    this.state.isScaledList
                        ? styles.scale
                        : {}
                ]}
                onContentSizeChange={this._onContentSizeChange}
                onLayout={this._onLayout}
                renderItem={this._renderItem}
                keyExtractor={keyExtractor}
                data={realData}
                onScroll={onScroll}
                {...refreshingProp}
            />
        );
    }
}

const styles = StyleSheet.create({
    scale: {
        transform: [{scaleY: -1}]
    },
    list: {
        flex: 1
    }
});

export default ListViewChat;
