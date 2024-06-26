/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CanvasState } from '../../../../../state';
import { createRemoteProcessGroup } from '../../../../../state/flow/flow.actions';
import { TextTipInput } from '../../../../../../../state/shared';
import { selectSaving } from '../../../../../state/flow/flow.selectors';
import { AsyncPipe } from '@angular/common';
import { ErrorBanner } from '../../../../../../../ui/common/error-banner/error-banner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NifiSpinnerDirective } from '../../../../../../../ui/common/spinner/nifi-spinner.directive';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextTip } from '../../../../../../../ui/common/tooltips/text-tip/text-tip.component';
import { NifiTooltipDirective } from '../../../../../../../ui/common/tooltips/nifi-tooltip.directive';
import { MatIconModule } from '@angular/material/icon';
import { CreateComponentRequest } from '../../../../../state/flow';

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        ErrorBanner,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        NifiSpinnerDirective,
        ReactiveFormsModule,
        MatOptionModule,
        MatSelectModule,
        NifiTooltipDirective,
        MatIconModule
    ],
    templateUrl: './create-remote-process-group.component.html',
    styleUrls: ['./create-remote-process-group.component.scss']
})
export class CreateRemoteProcessGroup {
    saving$ = this.store.select(selectSaving);

    protected readonly TextTip = TextTip;

    createRemoteProcessGroupForm: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) private dialogRequest: CreateComponentRequest,
        private formBuilder: FormBuilder,
        private store: Store<CanvasState>
    ) {
        this.createRemoteProcessGroupForm = this.formBuilder.group({
            urls: new FormControl('', Validators.required),
            transportProtocol: new FormControl('RAW', Validators.required),
            localNetworkInterface: new FormControl(''),
            httpProxyServerHostname: new FormControl(''),
            httpProxyServerPort: new FormControl(''),
            httpProxyUser: new FormControl(''),
            httpProxyPassword: new FormControl(''),
            communicationsTimeout: new FormControl('30 sec', Validators.required),
            yieldDuration: new FormControl('10 sec', Validators.required)
        });
    }

    getOptionTipData(tip: string): TextTipInput {
        return {
            text: tip
        };
    }

    createRemoteProcessGroup(): void {
        this.store.dispatch(
            createRemoteProcessGroup({
                request: {
                    ...this.dialogRequest,
                    targetUris: this.createRemoteProcessGroupForm.get('urls')?.value,
                    transportProtocol: this.createRemoteProcessGroupForm.get('transportProtocol')?.value,
                    localNetworkInterface: this.createRemoteProcessGroupForm.get('localNetworkInterface')?.value,
                    proxyHost: this.createRemoteProcessGroupForm.get('httpProxyServerHostname')?.value,
                    proxyPort: this.createRemoteProcessGroupForm.get('httpProxyServerPort')?.value,
                    proxyUser: this.createRemoteProcessGroupForm.get('httpProxyUser')?.value,
                    proxyPassword: this.createRemoteProcessGroupForm.get('httpProxyPassword')?.value,
                    communicationsTimeout: this.createRemoteProcessGroupForm.get('communicationsTimeout')?.value,
                    yieldDuration: this.createRemoteProcessGroupForm.get('yieldDuration')?.value
                }
            })
        );
    }
}
