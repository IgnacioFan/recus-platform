<script>
import { Line } from "vue-chartjs";

export default {
  name: "AreaChart",
  props: {
    initialData: {
      type: Array,
      default: () => [
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "A"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "B"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "C"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "D"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "E"
        }
      ]
    }
  },
  extends: Line,
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient3 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient4 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient5 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.9)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.45)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(255, 150, 0, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(255, 150, 0, 0.9)");
    this.gradient2.addColorStop(1, "rgba(255, 150, 0, 0)");

    this.gradient3.addColorStop(0, "rgba(160, 255,100, 0.9)");
    this.gradient3.addColorStop(0.5, "rgba(160, 255, 100, 0.9)");
    this.gradient3.addColorStop(1, "rgba(160, 255, 100, 0)");

    this.gradient4.addColorStop(0, "rgba(30, 135, 200, 0.9)");
    this.gradient4.addColorStop(0.5, "rgba(30, 135, 200, 0.9)");
    this.gradient4.addColorStop(1, "rgba(30, 135, 200, 0)");

    this.gradient5.addColorStop(0, "rgba(120, 45, 170, 0.9)");
    this.gradient5.addColorStop(0.5, "rgba(120, 45, 170, 0.45)");
    this.gradient5.addColorStop(1, "rgba(120, 45, 170, 0)");

    this.renderChart(
      {
        labels: [...this.initialData[0].range],
        datasets: [
          {
            label: this.initialData[0].title,
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: this.gradient,
            data: [...this.initialData[0].count]
          },
          {
            label: this.initialData[1].title,
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            backgroundColor: this.gradient2,
            data: [...this.initialData[1].count]
          },
          {
            label: this.initialData[2].title,
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: this.gradient3,
            data: [...this.initialData[2].count]
          },
          {
            label: this.initialData[3].title,
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            backgroundColor: this.gradient4,
            data: [...this.initialData[3].count]
          },
          {
            label: this.initialData[4].title,
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            backgroundColor: this.gradient5,
            data: [...this.initialData[4].count]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
