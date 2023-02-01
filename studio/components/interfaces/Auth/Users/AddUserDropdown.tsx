import * as Tooltip from '@radix-ui/react-tooltip'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { checkPermissions } from 'hooks'
import { IS_PLATFORM } from 'lib/constants'
import { useState } from 'react'
import semver from 'semver'
import { Button, Dropdown, IconMail, IconPlus, IconUserPlus } from 'ui'
import CreateUserModal from './CreateUserModal'
import InviteUserModal from './InviteUserModal'

export type AddUserDropdownProps = {
  projectKpsVersion?: string
}

const AddUserDropdown = ({ projectKpsVersion }: AddUserDropdownProps) => {
  const inviteEnabled = IS_PLATFORM
    ? semver.gte(
        // @ts-ignore
        semver.coerce(projectKpsVersion ?? 'kps-v2.5.4'),
        semver.coerce('kps-v2.5.3')
      )
    : true

  const canInviteUsers = checkPermissions(PermissionAction.AUTH_EXECUTE, 'invite_user')
  const canCreateUsers = checkPermissions(PermissionAction.AUTH_EXECUTE, 'create_user')

  const [inviteVisible, setInviteVisible] = useState(false)
  const [createVisible, setCreateVisible] = useState(false)

  return (
    <>
      <Dropdown
        side="bottom"
        align="end"
        size="small"
        overlay={
          <>
            {inviteEnabled && (
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger className="w-full">
                  <Dropdown.Item
                    icon={<IconMail size="small" />}
                    disabled={!canInviteUsers}
                    onClick={() => setInviteVisible(true)}
                  >
                    Send Invitation
                  </Dropdown.Item>
                </Tooltip.Trigger>
                {!canInviteUsers && (
                  <Tooltip.Content side="bottom">
                    <Tooltip.Arrow className="radix-tooltip-arrow" />
                    <div
                      className={[
                        'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                        'border border-scale-200',
                      ].join(' ')}
                    >
                      <span className="text-xs text-scale-1200">
                        You need additional permissions to invite users
                      </span>
                    </div>
                  </Tooltip.Content>
                )}
              </Tooltip.Root>
            )}

            <Tooltip.Root delayDuration={0}>
              <Tooltip.Trigger className="w-full">
                <Dropdown.Item
                  icon={<IconUserPlus size="small" />}
                  disabled={!canCreateUsers}
                  onClick={() => setCreateVisible(true)}
                >
                  Create New User
                </Dropdown.Item>
              </Tooltip.Trigger>

              {!canCreateUsers && (
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow className="radix-tooltip-arrow" />
                  <div
                    className={[
                      'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                      'border border-scale-200',
                    ].join(' ')}
                  >
                    <span className="text-xs text-scale-1200">
                      You need additional permissions to create users
                    </span>
                  </div>
                </Tooltip.Content>
              )}
            </Tooltip.Root>
          </>
        }
      >
        <Button type="primary" icon={<IconPlus strokeWidth={1.5} />}>
          Add User
        </Button>
      </Dropdown>

      {inviteEnabled && <InviteUserModal visible={inviteVisible} setVisible={setInviteVisible} />}
      <CreateUserModal visible={createVisible} setVisible={setCreateVisible} />
    </>
  )
}

export default AddUserDropdown