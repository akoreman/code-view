// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCurrentMode } from "@cloudscape-design/component-toolkit/internal";
import Box from "@cloudscape-design/components/box";
import { TextHighlightRules } from "ace-code/src/mode/text_highlight_rules";
import clsx from "clsx";
import { useRef } from "react";
import { Children } from "react";
import { InternalBaseComponentProps, getBaseProps } from "../internal/base-component/use-base-component";
import { createHighlight } from "./highlight";
import { CodeViewProps } from "./interfaces";
import styles from "./styles.css.js";

const ACE_CLASSES = { light: "ace-cloud_editor", dark: "ace-cloud_editor_dark" };

type InternalCodeViewProps = CodeViewProps & InternalBaseComponentProps;

const textHighlight = createHighlight(new TextHighlightRules());

export function InternalCodeView({
  content,
  actions,
  lineNumbers,
  lineWrapping,
  highlight,
  ariaLabel,
  ariaLabelledby,
  __internalRootRef = null,
  ...props
}: InternalCodeViewProps) {
  const baseProps = getBaseProps(props);
  const preRef = useRef<HTMLPreElement>(null);
  const darkMode = useCurrentMode(preRef) === "dark";

  const regionProps = ariaLabel || ariaLabelledby ? { role: "region" } : {};

  // Create tokenized elements of the content.
  const code = highlight ? highlight(content) : textHighlight(content);

  return (
    <div
      className={clsx(darkMode ? ACE_CLASSES.dark : ACE_CLASSES.light, styles.root)}
      {...regionProps}
      {...baseProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      ref={__internalRootRef}
    >
      <table className={clsx(styles["code-table"])}>
        <colgroup>
          <col style={{ width: 1 } /* shrink to fit content */} />
          <col style={{ width: "auto" }} />
        </colgroup>
        <tbody>
          {Children.map(code.props.children, (child, index) => {
            return (
              <tr key={index}>
                {lineNumbers && (
                  <td className={clsx(styles["line-number"], styles.unselectable)} aria-hidden={true}>
                    <Box color="text-status-inactive" fontSize="body-m">
                      {index + 1}
                    </Box>
                  </td>
                )}
                <td className={styles["code-line"]}>
                  <Box color="text-status-inactive" variant="code" fontSize="body-m">
                    <span
                      className={clsx(
                        code.props.className,
                        lineWrapping ? styles["code-line-wrap"] : styles["code-line-nowrap"]
                      )}
                    >
                      {child}
                    </span>
                  </Box>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}