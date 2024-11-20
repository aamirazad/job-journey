import FormWrapper from "@/components/auth/form-wrapper";
import { Button } from "@/components/ui/button";

export default function UserSettings() {
  return (
    <FormWrapper>
      <form>
        <div>
          <label>
            Name:
            <input type="text" />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="email" />
          </label>
        </div>
        <div>
          <label>
            Role:
            <select>
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              {/* Add more roles as needed */}
            </select>
          </label>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </FormWrapper>
  );
}
