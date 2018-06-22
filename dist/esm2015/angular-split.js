import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, HostBinding, Input, NgModule, NgZone, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * angular-split
 *
 * Areas size are set in percentage of the split container.
 * Gutters size are set in pixels.
 *
 * So we set css 'flex-basis' property like this (where 0 <= area.size <= 1):
 *  calc( { area.size * 100 }% - { area.size * nbGutter * gutterSize }px );
 *
 * Examples with 3 visible areas and 2 gutters:
 *
 * |                     10px                   10px                                  |
 * |---------------------[]---------------------[]------------------------------------|
 * |  calc(20% - 4px)          calc(20% - 4px)              calc(60% - 12px)          |
 *
 *
 * |                          10px                        10px                        |
 * |--------------------------[]--------------------------[]--------------------------|
 * |  calc(33.33% - 6.667px)      calc(33.33% - 6.667px)      calc(33.33% - 6.667px)  |
 *
 *
 * |10px                                                  10px                        |
 * |[]----------------------------------------------------[]--------------------------|
 * |0                 calc(66.66% - 13.333px)                  calc(33%% - 6.667px)   |
 *
 *
 *  10px 10px                                                                         |
 * |[][]------------------------------------------------------------------------------|
 * |0 0                               calc(100% - 20px)                               |
 *
 */
class SplitComponent {
    /**
     * @param {?} ngZone
     * @param {?} elRef
     * @param {?} cdRef
     * @param {?} renderer
     */
    constructor(ngZone, elRef, cdRef, renderer) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.cdRef = cdRef;
        this.renderer = renderer;
        this._direction = 'horizontal';
        this._useTransition = false;
        this._disabled = false;
        this._width = null;
        this._height = null;
        this._gutterSize = 11;
        this._gutterColor = '';
        this._gutterImageH = '';
        this._gutterImageV = '';
        this._dir = 'ltr';
        this.dragStart = new EventEmitter(false);
        this.dragProgress = new EventEmitter(false);
        this.dragEnd = new EventEmitter(false);
        this.gutterClick = new EventEmitter(false);
        this.transitionEndInternal = new Subject$1();
        this.transitionEnd = (/** @type {?} */ (this.transitionEndInternal.asObservable())).debounceTime(20);
        this.isViewInitialized = false;
        this.isDragging = false;
        this.draggingWithoutMove = false;
        this.currentGutterNum = 0;
        this.displayedAreas = [];
        this.hidedAreas = [];
        this.dragListeners = [];
        this.dragStartValues = {
            sizePixelContainer: 0,
            sizePixelA: 0,
            sizePixelB: 0,
            sizePercentA: 0,
            sizePercentB: 0,
        };
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set direction(v) {
        v = (v === 'vertical') ? 'vertical' : 'horizontal';
        this._direction = v;
        [...this.displayedAreas, ...this.hidedAreas].forEach(area => {
            area.comp.setStyleVisibleAndDir(area.comp.visible, this.isDragging, this.direction);
        });
        this.build(false, false);
    }
    /**
     * @return {?}
     */
    get direction() {
        return this._direction;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set useTransition(v) {
        v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
        this._useTransition = v;
    }
    /**
     * @return {?}
     */
    get useTransition() {
        return this._useTransition;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set disabled(v) {
        v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
        this._disabled = v;
        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    /**
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set width(v) {
        v = Number(v);
        this._width = (!isNaN(v) && v > 0) ? v : null;
        this.build(false, false);
    }
    /**
     * @return {?}
     */
    get width() {
        return this._width;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set height(v) {
        v = Number(v);
        this._height = (!isNaN(v) && v > 0) ? v : null;
        this.build(false, false);
    }
    /**
     * @return {?}
     */
    get height() {
        return this._height;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set gutterSize(v) {
        v = Number(v);
        this._gutterSize = (!isNaN(v) && v > 0) ? v : 11;
        this.build(false, false);
    }
    /**
     * @return {?}
     */
    get gutterSize() {
        return this._gutterSize;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set gutterColor(v) {
        this._gutterColor = (typeof v === 'string' && v !== '') ? v : '';
        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    /**
     * @return {?}
     */
    get gutterColor() {
        return this._gutterColor;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set gutterImageH(v) {
        this._gutterImageH = (typeof v === 'string' && v !== '') ? v : '';
        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    /**
     * @return {?}
     */
    get gutterImageH() {
        return this._gutterImageH;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set gutterImageV(v) {
        this._gutterImageV = (typeof v === 'string' && v !== '') ? v : '';
        // Force repaint if modified from TS class (instead of the template)
        this.cdRef.markForCheck();
    }
    /**
     * @return {?}
     */
    get gutterImageV() {
        return this._gutterImageV;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set dir(v) {
        v = (v === 'rtl') ? 'rtl' : 'ltr';
        this._dir = v;
    }
    /**
     * @return {?}
     */
    get dir() {
        return this._dir;
    }
    /**
     * @return {?}
     */
    get cssFlexdirection() {
        return (this.direction === 'horizontal') ? 'row' : 'column';
    }
    /**
     * @return {?}
     */
    get cssWidth() {
        return this.width ? `${this.width}px` : '100%';
    }
    /**
     * @return {?}
     */
    get cssHeight() {
        return this.height ? `${this.height}px` : '100%';
    }
    /**
     * @return {?}
     */
    get cssMinwidth() {
        return (this.direction === 'horizontal') ? `${this.getNbGutters() * this.gutterSize}px` : null;
    }
    /**
     * @return {?}
     */
    get cssMinheight() {
        return (this.direction === 'vertical') ? `${this.getNbGutters() * this.gutterSize}px` : null;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.isViewInitialized = true;
    }
    /**
     * @return {?}
     */
    getNbGutters() {
        return this.displayedAreas.length - 1;
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    addArea(comp) {
        const /** @type {?} */ newArea = {
            comp,
            order: 0,
            size: 0,
        };
        if (comp.visible === true) {
            this.displayedAreas.push(newArea);
        }
        else {
            this.hidedAreas.push(newArea);
        }
        comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
        this.build(true, true);
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    removeArea(comp) {
        if (this.displayedAreas.some(a => a.comp === comp)) {
            const /** @type {?} */ area = /** @type {?} */ (this.displayedAreas.find(a => a.comp === comp));
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            this.build(true, true);
        }
        else if (this.hidedAreas.some(a => a.comp === comp)) {
            const /** @type {?} */ area = /** @type {?} */ (this.hidedAreas.find(a => a.comp === comp));
            this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        }
    }
    /**
     * @param {?} comp
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    updateArea(comp, resetOrders, resetSizes) {
        // Only refresh if area is displayed (No need to check inside 'hidedAreas')
        const /** @type {?} */ item = this.displayedAreas.find(a => a.comp === comp);
        if (item) {
            this.build(resetOrders, resetSizes);
        }
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    showArea(comp) {
        const /** @type {?} */ area = this.hidedAreas.find(a => a.comp === comp);
        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
            const /** @type {?} */ areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            this.displayedAreas.push(...areas);
            this.build(true, true);
        }
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    hideArea(comp) {
        const /** @type {?} */ area = this.displayedAreas.find(a => a.comp === comp);
        if (area) {
            comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.direction);
            const /** @type {?} */ areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            areas.forEach(area => {
                area.order = 0;
                area.size = 0;
            });
            this.hidedAreas.push(...areas);
            this.build(true, true);
        }
    }
    /**
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    build(resetOrders, resetSizes) {
        this.stopDragging();
        // ¤ AREAS ORDER
        if (resetOrders === true) {
            // If user provided 'order' for each area, use it to sort them.
            if (this.displayedAreas.every(a => a.comp.order !== null)) {
                this.displayedAreas.sort((a, b) => (/** @type {?} */ (a.comp.order)) - (/** @type {?} */ (b.comp.order)));
            }
            // Then set real order with multiples of 2, numbers between will be used by gutters.
            this.displayedAreas.forEach((area, i) => {
                area.order = i * 2;
                area.comp.setStyleOrder(area.order);
            });
        }
        // ¤ AREAS SIZE PERCENT
        if (resetSizes === true) {
            const /** @type {?} */ totalUserSize = /** @type {?} */ (this.displayedAreas.reduce((total, s) => s.comp.size ? total + s.comp.size : total, 0));
            // If user provided 'size' for each area and total == 1, use it.
            if (this.displayedAreas.every(a => a.comp.size !== null) && totalUserSize > .999 && totalUserSize < 1.001) {
                this.displayedAreas.forEach(area => {
                    area.size = /** @type {?} */ (area.comp.size);
                });
            }
            else {
                const /** @type {?} */ size = 1 / this.displayedAreas.length;
                this.displayedAreas.forEach(area => {
                    area.size = size;
                });
            }
        }
        // ¤
        // If some real area sizes are less than gutterSize,
        // set them to zero and dispatch size to others.
        let /** @type {?} */ percentToDispatch = 0;
        // Get container pixel size
        let /** @type {?} */ containerSizePixel = this.getNbGutters() * this.gutterSize;
        if (this.direction === 'horizontal') {
            containerSizePixel = this.width ? this.width : this.elRef.nativeElement['offsetWidth'];
        }
        else {
            containerSizePixel = this.height ? this.height : this.elRef.nativeElement['offsetHeight'];
        }
        this.displayedAreas.forEach(area => {
            if (area.size * containerSizePixel < this.gutterSize) {
                percentToDispatch += area.size;
                area.size = 0;
            }
        });
        if (percentToDispatch > 0 && this.displayedAreas.length > 0) {
            const /** @type {?} */ nbAreasNotZero = this.displayedAreas.filter(a => a.size !== 0).length;
            if (nbAreasNotZero > 0) {
                const /** @type {?} */ percentToAdd = percentToDispatch / nbAreasNotZero;
                this.displayedAreas.filter(a => a.size !== 0).forEach(area => {
                    area.size += percentToAdd;
                });
            }
            else {
                this.displayedAreas[this.displayedAreas.length - 1].size = 1;
            }
        }
        this.refreshStyleSizes();
        this.cdRef.markForCheck();
    }
    /**
     * @return {?}
     */
    refreshStyleSizes() {
        const /** @type {?} */ sumGutterSize = this.getNbGutters() * this.gutterSize;
        this.displayedAreas.forEach(area => {
            area.comp.setStyleFlexbasis(`calc( ${area.size * 100}% - ${area.size * sumGutterSize}px )`, this.isDragging);
        });
    }
    /**
     * @param {?} startEvent
     * @param {?} gutterOrder
     * @param {?} gutterNum
     * @return {?}
     */
    startDragging(startEvent, gutterOrder, gutterNum) {
        startEvent.preventDefault();
        // Place code here to allow '(gutterClick)' event even if '[disabled]="true"'.
        this.currentGutterNum = gutterNum;
        this.draggingWithoutMove = true;
        this.ngZone.runOutsideAngular(() => {
            this.dragListeners.push(this.renderer.listen('document', 'mouseup', (e) => this.stopDragging()));
            this.dragListeners.push(this.renderer.listen('document', 'touchend', (e) => this.stopDragging()));
            this.dragListeners.push(this.renderer.listen('document', 'touchcancel', (e) => this.stopDragging()));
        });
        if (this.disabled) {
            return;
        }
        const /** @type {?} */ areaA = this.displayedAreas.find(a => a.order === gutterOrder - 1);
        const /** @type {?} */ areaB = this.displayedAreas.find(a => a.order === gutterOrder + 1);
        if (!areaA || !areaB) {
            return;
        }
        const /** @type {?} */ prop = (this.direction === 'horizontal') ? 'offsetWidth' : 'offsetHeight';
        this.dragStartValues.sizePixelContainer = this.elRef.nativeElement[prop];
        this.dragStartValues.sizePixelA = areaA.comp.getSizePixel(prop);
        this.dragStartValues.sizePixelB = areaB.comp.getSizePixel(prop);
        this.dragStartValues.sizePercentA = areaA.size;
        this.dragStartValues.sizePercentB = areaB.size;
        let /** @type {?} */ start;
        if (startEvent instanceof MouseEvent) {
            start = {
                x: startEvent.screenX,
                y: startEvent.screenY,
            };
        }
        else if (startEvent instanceof TouchEvent) {
            start = {
                x: startEvent.touches[0].screenX,
                y: startEvent.touches[0].screenY,
            };
        }
        else {
            return;
        }
        this.ngZone.runOutsideAngular(() => {
            this.dragListeners.push(this.renderer.listen('document', 'mousemove', (e) => this.dragEvent(e, start, areaA, areaB)));
            this.dragListeners.push(this.renderer.listen('document', 'touchmove', (e) => this.dragEvent(e, start, areaA, areaB)));
        });
        areaA.comp.lockEvents();
        areaB.comp.lockEvents();
        this.isDragging = true;
        this.notify('start');
    }
    /**
     * @param {?} event
     * @param {?} start
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    dragEvent(event, start, areaA, areaB) {
        if (!this.isDragging) {
            return;
        }
        let /** @type {?} */ end;
        if (event instanceof MouseEvent) {
            end = {
                x: event.screenX,
                y: event.screenY,
            };
        }
        else if (event instanceof TouchEvent) {
            end = {
                x: event.touches[0].screenX,
                y: event.touches[0].screenY,
            };
        }
        else {
            return;
        }
        this.draggingWithoutMove = false;
        this.drag(start, end, areaA, areaB);
    }
    /**
     * @param {?} start
     * @param {?} end
     * @param {?} areaA
     * @param {?} areaB
     * @return {?}
     */
    drag(start, end, areaA, areaB) {
        // ¤ AREAS SIZE PIXEL
        const /** @type {?} */ devicePixelRatio = window.devicePixelRatio || 1;
        let /** @type {?} */ offsetPixel = (this.direction === 'horizontal') ? (start.x - end.x) : (start.y - end.y);
        offsetPixel = offsetPixel / devicePixelRatio;
        if (this.dir === 'rtl') {
            offsetPixel = -offsetPixel;
        }
        let /** @type {?} */ newSizePixelA = this.dragStartValues.sizePixelA - offsetPixel;
        let /** @type {?} */ newSizePixelB = this.dragStartValues.sizePixelB + offsetPixel;
        let /** @type {?} */ minAreaA = areaA.comp.minSize * 100;
        let /** @type {?} */ minAreaB = areaB.comp.minSize * 100;
        if (newSizePixelA < this.gutterSize && newSizePixelB < this.gutterSize) {
            // WTF.. get out of here!
            return;
        }
        else if (newSizePixelA < minAreaA) {
            newSizePixelB -= newSizePixelA - minAreaA;
            newSizePixelA = minAreaA;
        }
        else if (newSizePixelB < minAreaB) {
            newSizePixelA += newSizePixelB - minAreaB;
            newSizePixelB = minAreaB;
        }
        else if (newSizePixelA < this.gutterSize) {
            newSizePixelB += newSizePixelA;
            newSizePixelA = 0;
        }
        else if (newSizePixelB < this.gutterSize) {
            newSizePixelA += newSizePixelB;
            newSizePixelB = 0;
        }
        // ¤ AREAS SIZE PERCENT
        if (newSizePixelA === 0) {
            areaB.size += areaA.size;
            areaA.size = 0;
        }
        else if (newSizePixelB === 0) {
            areaA.size += areaB.size;
            areaB.size = 0;
        }
        else {
            // NEW_PERCENT = START_PERCENT / START_PIXEL * NEW_PIXEL;
            if (this.dragStartValues.sizePercentA === 0) {
                areaB.size = this.dragStartValues.sizePercentB / this.dragStartValues.sizePixelB * newSizePixelB;
                areaA.size = this.dragStartValues.sizePercentB - areaB.size;
            }
            else if (this.dragStartValues.sizePercentB === 0) {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = this.dragStartValues.sizePercentA - areaA.size;
            }
            else {
                areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
                areaB.size = (this.dragStartValues.sizePercentA + this.dragStartValues.sizePercentB) - areaA.size;
            }
        }
        this.refreshStyleSizes();
        this.notify('progress');
    }
    /**
     * @return {?}
     */
    stopDragging() {
        if (this.isDragging === false && this.draggingWithoutMove === false) {
            return;
        }
        this.displayedAreas.forEach(area => {
            area.comp.unlockEvents();
        });
        while (this.dragListeners.length > 0) {
            const /** @type {?} */ fct = this.dragListeners.pop();
            if (fct) {
                fct();
            }
        }
        if (this.draggingWithoutMove === true) {
            this.notify('click');
        }
        else {
            this.notify('end');
        }
        this.isDragging = false;
        this.draggingWithoutMove = false;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    notify(type) {
        const /** @type {?} */ areasSize = this.displayedAreas.map(a => a.size * 100);
        switch (type) {
            case 'start':
                return this.dragStart.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'progress':
                return this.dragProgress.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'end':
                return this.dragEnd.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'click':
                return this.gutterClick.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
            case 'transitionEnd':
                return this.transitionEndInternal.next(areasSize);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.stopDragging();
    }
}
SplitComponent.decorators = [
    { type: Component, args: [{
                selector: 'split',
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
        :host {
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: stretch;
            overflow: hidden;
            /* 
                Important to keep following rules even if overrided later by 'HostBinding' 
                because if [width] & [height] not provided, when build() is executed,
                'HostBinding' hasn't been applied yet so code:
                this.elRef.nativeElement["offsetHeight"] gives wrong value!  
             */
            width: 100%;
            height: 100%;   
        }

        split-gutter {
            flex-grow: 0;
            flex-shrink: 0;
            background-position: center center;
            background-repeat: no-repeat;
        }
    `],
                template: `
        <ng-content></ng-content>
        <ng-template ngFor let-area [ngForOf]="displayedAreas" let-index="index" let-last="last">
            <split-gutter *ngIf="last === false" 
                          [order]="index*2+1"
                          [direction]="direction"
                          [useTransition]="useTransition"
                          [size]="gutterSize"
                          [color]="gutterColor"
                          [imageH]="gutterImageH"
                          [imageV]="gutterImageV"
                          [disabled]="disabled"
                          (mousedown)="startDragging($event, index*2+1, index+1)"
                          (touchstart)="startDragging($event, index*2+1, index+1)"></split-gutter>
        </ng-template>`,
            },] },
];
/** @nocollapse */
SplitComponent.ctorParameters = () => [
    { type: NgZone, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: Renderer2, },
];
SplitComponent.propDecorators = {
    "direction": [{ type: Input },],
    "useTransition": [{ type: Input },],
    "disabled": [{ type: Input },],
    "width": [{ type: Input },],
    "height": [{ type: Input },],
    "gutterSize": [{ type: Input },],
    "gutterColor": [{ type: Input },],
    "gutterImageH": [{ type: Input },],
    "gutterImageV": [{ type: Input },],
    "dir": [{ type: Input },],
    "dragStart": [{ type: Output },],
    "dragProgress": [{ type: Output },],
    "dragEnd": [{ type: Output },],
    "gutterClick": [{ type: Output },],
    "transitionEnd": [{ type: Output },],
    "cssFlexdirection": [{ type: HostBinding, args: ['style.flex-direction',] },],
    "cssWidth": [{ type: HostBinding, args: ['style.width',] },],
    "cssHeight": [{ type: HostBinding, args: ['style.height',] },],
    "cssMinwidth": [{ type: HostBinding, args: ['style.min-width',] },],
    "cssMinheight": [{ type: HostBinding, args: ['style.min-height',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SplitAreaDirective {
    /**
     * @param {?} ngZone
     * @param {?} elRef
     * @param {?} renderer
     * @param {?} split
     */
    constructor(ngZone, elRef, renderer, split) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.renderer = renderer;
        this.split = split;
        this._order = null;
        this._size = null;
        this._minSize = 0;
        this._visible = true;
        this.lockListeners = [];
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set order(v) {
        v = Number(v);
        this._order = !isNaN(v) ? v : null;
        this.split.updateArea(this, true, false);
    }
    /**
     * @return {?}
     */
    get order() {
        return this._order;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set size(v) {
        v = Number(v);
        this._size = (!isNaN(v) && v >= 0 && v <= 100) ? (v / 100) : null;
        this.split.updateArea(this, false, true);
    }
    /**
     * @return {?}
     */
    get size() {
        return this._size;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set minSize(v) {
        v = Number(v);
        this._minSize = (!isNaN(v) && v > 0 && v < 100) ? v / 100 : 0;
        this.split.updateArea(this, false, true);
    }
    /**
     * @return {?}
     */
    get minSize() {
        return this._minSize;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set visible(v) {
        v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
        this._visible = v;
        if (this.visible) {
            this.split.showArea(this);
        }
        else {
            this.split.hideArea(this);
        }
    }
    /**
     * @return {?}
     */
    get visible() {
        return this._visible;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.split.addArea(this);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', '0');
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', '0');
        this.ngZone.runOutsideAngular(() => {
            this.transitionListener = this.renderer.listen(this.elRef.nativeElement, 'transitionend', (e) => this.onTransitionEnd(e));
        });
    }
    /**
     * @param {?} prop
     * @return {?}
     */
    getSizePixel(prop) {
        return this.elRef.nativeElement[prop];
    }
    /**
     * @param {?} isVisible
     * @param {?} isDragging
     * @param {?} direction
     * @return {?}
     */
    setStyleVisibleAndDir(isVisible, isDragging, direction) {
        if (isVisible === false) {
            this.setStyleFlexbasis('0', isDragging);
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-x', 'hidden');
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-y', 'hidden');
            if (direction === 'vertical') {
                this.renderer.setStyle(this.elRef.nativeElement, 'max-width', '0');
            }
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-x', 'hidden');
            this.renderer.setStyle(this.elRef.nativeElement, 'overflow-y', 'auto');
            this.renderer.removeStyle(this.elRef.nativeElement, 'max-width');
        }
        if (direction === 'horizontal') {
            this.renderer.setStyle(this.elRef.nativeElement, 'height', '100%');
            this.renderer.removeStyle(this.elRef.nativeElement, 'width');
        }
        else {
            this.renderer.setStyle(this.elRef.nativeElement, 'width', '100%');
            this.renderer.removeStyle(this.elRef.nativeElement, 'height');
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setStyleOrder(value) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
    }
    /**
     * @param {?} value
     * @param {?} isDragging
     * @return {?}
     */
    setStyleFlexbasis(value, isDragging) {
        // If component not yet initialized or gutter being dragged, disable transition
        if (this.split.isViewInitialized === false || isDragging === true) {
            this.setStyleTransition(false);
        }
        else {
            this.setStyleTransition(this.split.useTransition);
        }
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', value);
    }
    /**
     * @param {?} useTransition
     * @return {?}
     */
    setStyleTransition(useTransition) {
        if (useTransition) {
            this.renderer.setStyle(this.elRef.nativeElement, 'transition', `flex-basis 0.3s`);
        }
        else {
            this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTransitionEnd(event) {
        // Limit only flex-basis transition to trigger the event
        if (event.propertyName === 'flex-basis') {
            this.split.notify('transitionEnd');
        }
    }
    /**
     * @return {?}
     */
    lockEvents() {
        this.ngZone.runOutsideAngular(() => {
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'selectstart', (e) => false));
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'dragstart', (e) => false));
        });
    }
    /**
     * @return {?}
     */
    unlockEvents() {
        while (this.lockListeners.length > 0) {
            const /** @type {?} */ fct = this.lockListeners.pop();
            if (fct) {
                fct();
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unlockEvents();
        if (this.transitionListener) {
            this.transitionListener();
        }
        this.split.removeArea(this);
    }
}
SplitAreaDirective.decorators = [
    { type: Directive, args: [{
                selector: 'split-area'
            },] },
];
/** @nocollapse */
SplitAreaDirective.ctorParameters = () => [
    { type: NgZone, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: SplitComponent, },
];
SplitAreaDirective.propDecorators = {
    "order": [{ type: Input },],
    "size": [{ type: Input },],
    "minSize": [{ type: Input },],
    "visible": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SplitGutterDirective {
    /**
     * @param {?} elRef
     * @param {?} renderer
     */
    constructor(elRef, renderer) {
        this.elRef = elRef;
        this.renderer = renderer;
        this._disabled = false;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set order(v) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', v);
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set direction(v) {
        this._direction = v;
        this.refreshStyle();
    }
    /**
     * @return {?}
     */
    get direction() {
        return this._direction;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set useTransition(v) {
        if (v) {
            this.renderer.setStyle(this.elRef.nativeElement, 'transition', `flex-basis 0.3s`);
        }
        else {
            this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
        }
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set size(v) {
        this._size = v;
        this.refreshStyle();
    }
    /**
     * @return {?}
     */
    get size() {
        return this._size;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set color(v) {
        this._color = v;
        this.refreshStyle();
    }
    /**
     * @return {?}
     */
    get color() {
        return this._color;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set imageH(v) {
        this._imageH = v;
        this.refreshStyle();
    }
    /**
     * @return {?}
     */
    get imageH() {
        return this._imageH;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set imageV(v) {
        this._imageV = v;
        this.refreshStyle();
    }
    /**
     * @return {?}
     */
    get imageV() {
        return this._imageV;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set disabled(v) {
        this._disabled = v;
        this.refreshStyle();
    }
    /**
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @return {?}
     */
    refreshStyle() {
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', `${this.size}px`);
        // fix safari bug about gutter height when direction is horizontal
        this.renderer.setStyle(this.elRef.nativeElement, 'height', (this.direction === 'vertical') ? `${this.size}px` : `100%`);
        this.renderer.setStyle(this.elRef.nativeElement, 'background-color', (this.color !== '') ? this.color : `#eeeeee`);
        const /** @type {?} */ state = (this.disabled === true) ? 'disabled' : this.direction;
        this.renderer.setStyle(this.elRef.nativeElement, 'background-image', this.getImage(state));
        this.renderer.setStyle(this.elRef.nativeElement, 'cursor', this.getCursor(state));
    }
    /**
     * @param {?} state
     * @return {?}
     */
    getCursor(state) {
        switch (state) {
            case 'horizontal':
                return 'col-resize';
            case 'vertical':
                return 'row-resize';
            case 'disabled':
                return 'default';
        }
    }
    /**
     * @param {?} state
     * @return {?}
     */
    getImage(state) {
        switch (state) {
            case 'horizontal':
                return (this.imageH !== '') ? this.imageH : defaultImageH;
            case 'vertical':
                return (this.imageV !== '') ? this.imageV : defaultImageV;
            case 'disabled':
                return '';
        }
    }
}
SplitGutterDirective.decorators = [
    { type: Directive, args: [{
                selector: 'split-gutter'
            },] },
];
/** @nocollapse */
SplitGutterDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
];
SplitGutterDirective.propDecorators = {
    "order": [{ type: Input },],
    "direction": [{ type: Input },],
    "useTransition": [{ type: Input },],
    "size": [{ type: Input },],
    "color": [{ type: Input },],
    "imageH": [{ type: Input },],
    "imageV": [{ type: Input },],
    "disabled": [{ type: Input },],
};
const defaultImageH = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==")';
const defaultImageV = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC")';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularSplitModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }
    /**
     * @return {?}
     */
    static forChild() {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }
}
AngularSplitModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    SplitComponent,
                    SplitAreaDirective,
                    SplitGutterDirective,
                ],
                exports: [
                    SplitComponent,
                    SplitAreaDirective,
                ]
            },] },
];
/** @nocollapse */
AngularSplitModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Public classes.

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Entry point for all public APIs of the package.
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { AngularSplitModule, SplitComponent, SplitAreaDirective, SplitGutterDirective as ɵa };
//# sourceMappingURL=angular-split.js.map
