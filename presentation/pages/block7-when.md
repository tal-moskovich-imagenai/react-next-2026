---
layout: center
clicks: 4
---

<div class="decision-slide">
  <div class="decision-caption">"This isn't the answer to every CLI need."</div>
  <DecisionFlow :step="$clicks" />
</div>

<style scoped>
.decision-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.decision-caption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #3D5940;
  font-style: italic;
}
</style>

<!--
Be honest about trade-offs. Not the answer to every CLI need.
[click 1] Show "real-time state?" question
[click 2] Show YES branch — Ink worth it
[click 3] Show NO branch — console.log is fine
[click 4] Show pattern picker below YES
-->

---
layout: two-cols
---

## Don't build from scratch: `@inkjs/ui`

```bash
npm install @inkjs/ui
```

```tsx
import { Select, TextInput,
         Spinner, ProgressBar } from "@inkjs/ui";
```

::right::

<TerminalFrame title="@inkjs/ui">
  <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.9; padding: 4px 0">
    <div class="ui-row">
      <span style="color:#3CFF7A">&lt;TextInput&gt;</span>
      <span style="color:#3D5940">  controlled input</span>
    </div>
    <div class="ui-row">
      <span style="color:#3CFF7A">&lt;Select&gt;</span>
      <span style="color:#3D5940">     arrow-key list</span>
    </div>
    <div class="ui-row">
      <span style="color:#3CFF7A">&lt;Spinner&gt;</span>
      <span style="color:#3D5940">    animated spinner</span>
    </div>
    <div class="ui-row">
      <span style="color:#3CFF7A">&lt;ProgressBar&gt;</span>
      <span style="color:#3D5940"> horizontal bar</span>
    </div>
    <div class="ui-row">
      <span style="color:#3CFF7A">&lt;Badge&gt;</span>
      <span style="color:#3D5940">      coloured label</span>
    </div>
    <div class="ui-row">
      <span style="color:#3CFF7A">&lt;StatusMessage&gt;</span>
      <span style="color:#3D5940">info/warn/error/ok</span>
    </div>
  </div>
</TerminalFrame>

<v-click>

<div style="margin-top: 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #3D5940">
  spend time on the product, not the widgets.
</div>

</v-click>

<style>
.ui-row {
  display: flex;
  gap: 0;
}
</style>

<!--
Natural closer after "when to reach for it" — save the audience some work.
-->
