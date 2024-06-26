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
package org.apache.nifi.prioritizer;

import org.apache.nifi.processor.Processor;
import org.apache.nifi.util.MockFlowFile;
import org.apache.nifi.util.MockProcessSession;
import org.apache.nifi.util.NoOpProcessor;
import org.apache.nifi.util.SharedSessionState;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
public class NewestFirstPrioritizerTest {

    @Test
    public void testPrioritizer() {
        final Processor processor = new NoOpProcessor();
        final AtomicLong idGenerator = new AtomicLong(0L);
        final MockProcessSession session = new MockProcessSession(new SharedSessionState(processor, idGenerator), Mockito.mock(Processor.class));

        final MockFlowFile flowFile1 = session.create();
        try {
            Thread.sleep(2); // guarantee the FlowFile entryDate for flowFile2 is different than flowFile1
        } catch (final InterruptedException e) {
        }
        final MockFlowFile flowFile2 = session.create();

        final NewestFlowFileFirstPrioritizer prioritizer = new NewestFlowFileFirstPrioritizer();
        assertEquals(0, prioritizer.compare(null, null));
        assertEquals(-1, prioritizer.compare(flowFile1, null));
        assertEquals(1, prioritizer.compare(null, flowFile1));
        assertEquals(0, prioritizer.compare(flowFile1, flowFile1));
        assertEquals(0, prioritizer.compare(flowFile2, flowFile2));
        assertEquals(1, prioritizer.compare(flowFile1, flowFile2));
        assertEquals(-1, prioritizer.compare(flowFile2, flowFile1));
    }

}
